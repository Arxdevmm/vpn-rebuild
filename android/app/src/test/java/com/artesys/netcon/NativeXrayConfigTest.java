package com.artesys.netcon;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.fail;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.junit.Test;

public final class NativeXrayConfigTest {
    @Test
    public void acceptsLocalXrayJson() throws Exception {
        NativeXrayConfig.ImportedServer imported = NativeXrayConfig.fromInput(
            "{\"outbounds\":[{\"tag\":\"proxy\",\"protocol\":\"vless\",\"settings\":{}}]}");
        assertEquals("Imported Xray configuration", imported.name);
        assertEquals(1, imported.config.getJSONArray("outbounds").length());
    }

    @Test
    public void rejectsXrayJsonWithoutSupportedProxyOutbound() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(
            "{\"outbounds\":[{\"protocol\":\"freedom\"}]}"));
    }

    @Test
    public void rejectsXrayJsonWithDuplicateProxyOutbounds() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(
            "{\"outbounds\":[{\"tag\":\"proxy\",\"protocol\":\"vless\"},{\"tag\":\"proxy\",\"protocol\":\"trojan\"}]}"));
    }

    @Test
    public void rejectsEmptyConfiguration() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(" "));
    }

    @Test
    public void rejectsJsonWithEmptyOutbounds() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput("{\"outbounds\":[]}"));
    }

    @Test
    public void rejectsOversizedConfiguration() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput("x".repeat(2_000_001)));
    }

    @Test
    public void parsesVlessRealityAndEncodedParameters() throws Exception {
        NativeXrayConfig.ImportedServer imported = NativeXrayConfig.fromInput(
            "vless://user-id@[2001:db8::1]:443?type=ws&security=reality&sni=edge.example&pbk=public-key&sid=42&path=%2Fvpn&host=front.example#My%20Node");
        assertEquals("My Node", imported.name);
        org.json.JSONObject proxy = proxy(imported);
        assertEquals("vless", proxy.getString("protocol"));
        org.json.JSONObject vnext = proxy.getJSONObject("settings").getJSONArray("vnext").getJSONObject(0);
        assertEquals("2001:db8::1", vnext.getString("address"));
        org.json.JSONObject reality = proxy.getJSONObject("streamSettings").getJSONObject("realitySettings");
        assertEquals("public-key", reality.getString("publicKey"));
        assertEquals("/vpn", proxy.getJSONObject("streamSettings").getJSONObject("wsSettings").getString("path"));
    }

    @Test
    public void parsesTrojanTlsParameters() throws Exception {
        NativeXrayConfig.ImportedServer imported = NativeXrayConfig.fromInput(
            "trojan://secret@example.com:8443?security=tls&sni=edge.example#Secure%20Node");
        assertEquals("Secure Node", imported.name);
        org.json.JSONObject proxy = proxy(imported);
        assertEquals("trojan", proxy.getString("protocol"));
        assertEquals("secret", proxy.getJSONObject("settings").getJSONArray("servers").getJSONObject(0).getString("password"));
        assertEquals("edge.example", proxy.getJSONObject("streamSettings").getJSONObject("tlsSettings").getString("serverName"));
    }

    @Test
    public void parsesVmessBase64Configuration() throws Exception {
        String json = "{\"add\":\"vmess.example\",\"port\":\"443\",\"id\":\"user-id\",\"ps\":\"VMess test\",\"net\":\"tcp\",\"tls\":\"tls\"}";
        String encoded = Base64.getEncoder().withoutPadding().encodeToString(json.getBytes(StandardCharsets.UTF_8));
        NativeXrayConfig.ImportedServer imported = NativeXrayConfig.fromInput("vmess://" + encoded);
        assertEquals("VMess test", imported.name);
        assertEquals("vmess", proxy(imported).getString("protocol"));
    }

    @Test
    public void parsesShadowsocksSip002Link() throws Exception {
        NativeXrayConfig.ImportedServer imported = NativeXrayConfig.fromInput(
            "ss://aes-128-gcm:pass%40word@example.com:8388#SS%20Node");
        assertEquals("SS Node", imported.name);
        org.json.JSONObject server = proxy(imported).getJSONObject("settings").getJSONArray("servers").getJSONObject(0);
        assertEquals("shadowsocks", proxy(imported).getString("protocol"));
        assertEquals("pass@word", server.getString("password"));
        assertEquals(8388, server.getInt("port"));
    }

    @Test
    public void rejectsShadowsocksPluginAndMultipleLinks() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(
            "ss://aes-128-gcm:password@example.com:8388?plugin=obfs"));
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(
            "vless://user@example.com:443\nvmess://encoded"));
    }

    @Test
    public void rejectsRealityWithoutPublicKey() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(
            "vless://user@example.com:443?security=reality"));
    }

    @Test
    public void rejectsUnsupportedTransport() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(
            "vless://user@example.com:443?type=unknown"));
    }

    private static org.json.JSONObject proxy(NativeXrayConfig.ImportedServer imported) {
        org.json.JSONArray outbounds = imported.config.optJSONArray("outbounds");
        for (int index = 0; index < outbounds.length(); index++) {
            org.json.JSONObject outbound = outbounds.optJSONObject(index);
            if ("proxy".equals(outbound.optString("tag"))) return outbound;
        }
        fail("Expected proxy outbound");
        return new org.json.JSONObject();
    }
}
