package com.artesys.netcon

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class NativeGeminiRecommenderTest {
    private val node = NativePublicDirectory.Node(
        id = "public-node",
        name = "VLESS · 1",
        protocol = "vless",
        country = "Japan",
        countryCode = "JP",
        configJson = "{}",
    )

    @Test
    fun parsesAllowedServerAndConnectionSettings() {
        val recommendation = NativeGeminiRecommender.parseRecommendation(
            """{"serverId":"public-node","reason":"Good fit.","dnsAddress":"1.1.1.1","routingMode":"Bypass LAN"}""",
            listOf(node),
        )

        assertEquals("public-node", recommendation.nodeId)
        assertEquals("1.1.1.1", recommendation.dnsAddress)
        assertEquals("Bypass LAN", recommendation.routingMode)
    }

    @Test
    fun rejectsUnlistedServerAndUnsupportedSettings() {
        val unlistedServer = """{"serverId":"other","reason":"No.","dnsAddress":"1.1.1.1","routingMode":"Global"}"""
        val unsupportedDns = """{"serverId":"public-node","reason":"No.","dnsAddress":"https://dns.example","routingMode":"Global"}"""
        val unsupportedRouting = """{"serverId":"public-node","reason":"No.","dnsAddress":"1.1.1.1","routingMode":"Automatic"}"""

        assertThrows(IllegalArgumentException::class.java) {
            NativeGeminiRecommender.parseRecommendation(unlistedServer, listOf(node))
        }
        assertThrows(IllegalArgumentException::class.java) {
            NativeGeminiRecommender.parseRecommendation(unsupportedDns, listOf(node))
        }
        assertThrows(IllegalArgumentException::class.java) {
            NativeGeminiRecommender.parseRecommendation(unsupportedRouting, listOf(node))
        }
    }
}
