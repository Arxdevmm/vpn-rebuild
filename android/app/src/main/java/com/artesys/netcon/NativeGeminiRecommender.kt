package com.artesys.netcon

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets

internal object NativeGeminiRecommender {
    data class Recommendation(val nodeId: String, val reason: String)

    suspend fun recommend(
        purpose: String,
        apiKey: String,
        accessToken: String,
        nodes: List<NativePublicDirectory.Node>,
    ): Recommendation =
        withContext(Dispatchers.IO) {
            val trimmedPurpose = purpose.trim().take(500)
            val trimmedKey = apiKey.trim()
            val trimmedToken = accessToken.trim()
            require(trimmedPurpose.isNotEmpty()) { "Describe what you want to use the VPN for." }
            require(!trimmedPurpose.startsWith("{") && !trimmedPurpose.startsWith("[") &&
                !Regex("(?i)(vmess|vless|trojan|ss)://|[\"']?(uuid|password|privateKey|alterId)[\"']?\\s*:").containsMatchIn(trimmedPurpose)
            ) {
                "Server configurations are parsed locally and must not be sent to Gemini."
            }
            require(trimmedKey.isNotEmpty() && trimmedKey.length <= 250) { "Enter a valid Gemini API key." }
            require(trimmedToken.isNotEmpty()) { "Sign in with Google before requesting a recommendation." }
            require(nodes.isNotEmpty()) { "Load public servers before asking Gemini for a recommendation." }

            val available = nodes.take(30)
            val metadata = JSONArray()
            available.forEach { node ->
                metadata.put(
                    JSONObject()
                        .put("id", node.id)
                        .put("protocol", node.protocol)
                        .put("country", node.country),
                )
            }
            val requestBody = JSONObject()
                .put("purpose", trimmedPurpose)
                .put("apiKey", trimmedKey)
                .put("servers", metadata)

            val baseUrl = BuildConfig.RECOMMENDATION_BASE_URL.trimEnd('/')
            require(baseUrl.startsWith("https://")) { "Recommendation service is not configured securely." }
            val connection = URL("$baseUrl/api/recommend").openConnection() as HttpURLConnection
            connection.connectTimeout = 10_000
            connection.readTimeout = 20_000
            connection.requestMethod = "POST"
            connection.doOutput = true
            connection.setRequestProperty("Content-Type", "application/json")
            connection.setRequestProperty("Authorization", "Bearer $trimmedToken")
            try {
                connection.outputStream.use { output ->
                    output.write(requestBody.toString().toByteArray(StandardCharsets.UTF_8))
                }
                val status = connection.responseCode
                val stream = if (status in 200..299) connection.inputStream else connection.errorStream
                val responseText = stream?.bufferedReader(StandardCharsets.UTF_8)?.use { reader ->
                    val text = reader.readText()
                    if (text.length > 100_000) throw IllegalStateException("Gemini response exceeded the size limit.")
                    text
                }.orEmpty()
                if (status == 401 || status == 403) throw NativeSupabaseAuth.SessionExpiredException()
                val response = JSONObject(responseText)
                if (status !in 200..299) {
                    throw IllegalStateException(response.optString("error").ifBlank { "Recommendation request failed with HTTP $status." })
                }
                val nodeId = response.optString("serverId")
                val reason = response.optString("reason").take(500)
                require(available.any { it.id == nodeId }) { "Gemini selected a server outside the available list." }
                Recommendation(nodeId, reason.ifBlank { "Recommended from the available server metadata." })
            } finally {
                connection.disconnect()
            }
        }
}