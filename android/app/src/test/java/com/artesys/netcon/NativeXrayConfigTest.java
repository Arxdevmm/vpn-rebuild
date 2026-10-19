package com.artesys.netcon;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import org.junit.Test;

public final class NativeXrayConfigTest {
    @Test
    public void acceptsLocalXrayJson() throws Exception {
        NativeXrayConfig.ImportedServer imported = NativeXrayConfig.fromInput("{\"outbounds\":[{\"protocol\":\"freedom\"}]}");
        assertEquals("Imported Xray configuration", imported.name);
        assertEquals(1, imported.config.getJSONArray("outbounds").length());
    }

    @Test
    public void rejectsEmptyConfiguration() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput(" "));
    }

    @Test
    public void rejectsJsonWithoutProxyOutbound() {
        assertThrows(Exception.class, () -> NativeXrayConfig.fromInput("{\"inbounds\":[]}"));
    }

    @Test
    public void rejectsJsonWithEmptyOutbounds() {
        assertThrows(IllegalArgumentException.class, () -> NativeXrayConfig.fromInput("{\"outbounds\":[]}"));
    }
}
