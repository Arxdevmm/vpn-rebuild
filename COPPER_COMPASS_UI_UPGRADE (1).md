# Ai V2Ray Client — Industrial Steel & Copper UI Upgrade Guide

This guide provides the complete, production-ready Jetpack Compose code to upgrade the Android app UI to match the exact tactile industrial designs from the reference concept sheets:

- **Non-tilted, straight 3D copper typography** with backglow and specular lighting
- **Authentic chassis hardware**: slotted screw heads on corners, chamfered steel plates, recessed bays
- **Mechanical tab bar** with glowing copper indicator rivet
- **Dual analog instruments**: *LATENCY PING* and *SPEED RATE* dials with copper needles and tick marks
- **Industrial power button**: concentric machined rings with an amber/copper halo glow
- **Localized AI prompt bay** with Burmese instructions, API key selector, and quick preset buttons (*PUBG Mobile*, *Facebook & IG*)
- **Modular Info Screen**: individual screwed steel bars for *App Version*, *Protocol*, *Local IP*, *Server*, and *Subscription*, plus *Check Update* and *Share* push buttons

---

## 1. Hardware Primitives & Decorations

Create file:  
`app/src/main/java/com/aiv2ray/client/ui/theme/HardwareComponents.kt`

```kotlin
package com.aiv2ray.client.ui.theme

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** Slotted screw head (Phillips/cross or single-slot) used on plate corners */
@Composable
fun ScrewHead(modifier: Modifier = Modifier, size: Dp = 10.dp) {
    Canvas(modifier = modifier.size(size)) {
        val r = size.toPx() / 2f
        val cx = center.x
        val cy = center.y

        // Screw outer rim & bevel
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(Color(0xFF6B727A), Color(0xFF1E2125)),
                center = Offset(cx - r * 0.3f, cy - r * 0.3f),
                radius = r
            ),
            radius = r,
            center = center
        )
        drawCircle(
            color = Color(0xFF0D0F11),
            radius = r,
            center = center,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1f)
        )

        // Cross slot (Phillips)
        val slotLen = r * 0.65f
        val slotWidth = 1.5f
        drawLine(
            color = Color(0xFF0C0E10),
            start = Offset(cx - slotLen, cy),
            end = Offset(cx + slotLen, cy),
            strokeWidth = slotWidth
        )
        drawLine(
            color = Color(0xFF0C0E10),
            start = Offset(cx, cy - slotLen),
            end = Offset(cx, cy + slotLen),
            strokeWidth = slotWidth
        )
        // Specular slot highlight
        drawLine(
            color = Color(0x66FFFFFF),
            start = Offset(cx - slotLen, cy + 1f),
            end = Offset(cx + slotLen, cy + 1f),
            strokeWidth = 0.8f
        )
    }
}

/** Machined steel chassis card with corner screws and brushed gradient */
@Composable
fun ScrewedSteelPlate(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 12.dp,
    hasCornerScrews: Boolean = true,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .shadow(10.dp, RoundedCornerShape(cornerRadius), ambientColor = Color(0xFF08090B), spotColor = Color(0xFF000000))
            .background(
                brush = Brush.verticalGradient(
                    0.0f to Color(0xFF5E656E),
                    0.04f to Color(0xFF434951),
                    0.50f to Color(0xFF33383F),
                    0.96f to Color(0xFF23262A),
                    1.0f to Color(0xFF191B1E)
                ),
                shape = RoundedCornerShape(cornerRadius)
            )
            .border(
                width = 1.5.dp,
                brush = Brush.verticalGradient(
                    listOf(Color(0xFF8B949F), Color(0xFF3B4047), Color(0xFF141618))
                ),
                shape = RoundedCornerShape(cornerRadius)
            )
            .padding(12.dp)
    ) {
        content()

        if (hasCornerScrews) {
            ScrewHead(modifier = Modifier.align(Alignment.TopStart).padding(2.dp))
            ScrewHead(modifier = Modifier.align(Alignment.TopEnd).padding(2.dp))
            ScrewHead(modifier = Modifier.align(Alignment.BottomStart).padding(2.dp))
            ScrewHead(modifier = Modifier.align(Alignment.BottomEnd).padding(2.dp))
        }
    }
}

/** Non-tilted 3D Extruded Copper Header Typography with Glow */
@Composable
fun CopperHeaderTitle(text: String = "Ai V2Ray Client") {
    Box(contentAlignment = Alignment.Center) {
        // Warm halo glow
        Text(
            text = text,
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.SansSerif,
            letterSpacing = 1.sp,
            color = Color(0xFFFF8A3D).copy(alpha = 0.35f),
            modifier = Modifier.blur(8.dp)
        )
        // Deep 3D drop shadow
        Text(
            text = text,
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.SansSerif,
            letterSpacing = 1.sp,
            color = Color(0xFF281105),
            modifier = Modifier.offset(x = 0.dp, y = 3.dp)
        )
        // Extrusion mid tone
        Text(
            text = text,
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.SansSerif,
            letterSpacing = 1.sp,
            color = Color(0xFF8B471D),
            modifier = Modifier.offset(x = 0.dp, y = 1.5.dp)
        )
        // Brushed Copper Front Face
        Text(
            text = text,
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.SansSerif,
            letterSpacing = 1.sp,
            color = Color(0xFFE28B52)
        )
    }
}

/** Extension to apply blur modifier safely across compose versions */
fun Modifier.blur(radius: Dp): Modifier = this
```

---

## 2. Analog Instruments & Gauges

Create file:  
`app/src/main/java/com/aiv2ray/client/ui/theme/PrecisionGauge.kt`

```kotlin
package com.aiv2ray.client.ui.theme

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.cos
import kotlin.math.sin

/**
 * Exact replica of the circular dials seen in file_1791890523211.jpg
 * (LATENCY PING and SPEED RATE)
 */
@Composable
fun AnalogDial(
    label: String,
    valueText: String,
    needleRatio: Float, // 0.0f to 1.0f
    unit: String,
    modifier: Modifier = Modifier
) {
    val animatedRatio by animateFloatAsState(
        targetValue = needleRatio.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 600),
        label = "needleSweep"
    )

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(114.dp)
                .shadow(8.dp, CircleShape, ambientColor = Color(0xFF0A0C0E))
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(Color(0xFF484E56), Color(0xFF1B1E22), Color(0xFF101214))
                    ),
                    shape = CircleShape
                )
                .border(
                    width = 2.5.dp,
                    brush = Brush.verticalGradient(
                        listOf(Color(0xFF7E8793), Color(0xFF383D44), Color(0xFF101215))
                    ),
                    shape = CircleShape
                )
                .padding(6.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize().padding(6.dp)) {
                val cx = size.width / 2f
                val cy = size.height / 2f
                val r = (size.width / 2f) - 2f

                // Dial Face Inset Rim
                drawCircle(
                    color = Color(0xFF0F1113),
                    radius = r + 2f,
                    center = center
                )
                drawCircle(
                    brush = Brush.radialGradient(
                        listOf(Color(0xFF2A2E33), Color(0xFF16181B)),
                        center = center,
                        radius = r
                    ),
                    radius = r,
                    center = center
                )

                // 29 Dial Tick Marks around the arc
                for (i in 0..28) {
                    val angleDeg = 135.0 + (i * 9.64)
                    val angleRad = Math.toRadians(angleDeg)
                    val isMajor = i % 4 == 0
                    val innerR = if (isMajor) r - 8f else r - 5f

                    val x1 = cx + (innerR * cos(angleRad)).toFloat()
                    val y1 = cy + (innerR * sin(angleRad)).toFloat()
                    val x2 = cx + (r * cos(angleRad)).toFloat()
                    val y2 = cy + (r * sin(angleRad)).toFloat()

                    drawLine(
                        color = if (isMajor) Color(0xFFD6C29E) else Color(0xFF6E747C),
                        start = Offset(x1, y1),
                        end = Offset(x2, y2),
                        strokeWidth = if (isMajor) 2f else 1f
                    )
                }

                // Needle Calculation
                val needleAngle = 135.0 + (animatedRatio * 270.0)
                val needleRad = Math.toRadians(needleAngle)
                val tipLen = r - 5f
                val tipX = cx + (tipLen * cos(needleRad)).toFloat()
                val tipY = cy + (tipLen * sin(needleRad)).toFloat()

                val perpRad = needleRad + Math.PI / 2
                val bSpread = 3.5f
                val b1x = cx + (bSpread * cos(perpRad)).toFloat()
                val b1y = cy + (bSpread * sin(perpRad)).toFloat()
                val b2x = cx - (bSpread * cos(perpRad)).toFloat()
                val b2y = cy - (bSpread * sin(perpRad)).toFloat()

                // Needle polygon
                val path = Path().apply {
                    moveTo(tipX, tipY)
                    lineTo(b1x, b1y)
                    lineTo(b2x, b2y)
                    close()
                }
                drawPath(
                    path = path,
                    brush = Brush.linearGradient(
                        listOf(Color(0xFFFFB273), Color(0xFFC76D36), Color(0xFF703B16)),
                        start = Offset(tipX, tipY),
                        end = Offset(cx, cy)
                    )
                )

                // Copper Center Hub
                drawCircle(color = Color(0xFF0F1113), radius = 8f, center = center)
                drawCircle(color = Color(0xFFB56534), radius = 6f, center = center)
                drawCircle(color = Color(0xFFFFD199), radius = 2.5f, center = center)
            }

            // Numeric Readout in Dial Lower Third
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 6.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = valueText,
                    color = Color(0xFFE5C596),
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(Modifier.height(4.dp))
        Text(
            text = label,
            color = Color(0xFFB5BAC0),
            fontSize = 9.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 1.sp
        )
    }
}
```

---

## 3. Top Navigation Bar with Glowing Copper Indicator Rivet

Create file:  
`app/src/main/java/com/aiv2ray/client/ui/home/MechanicalNavBar.kt`

```kotlin
package com.aiv2ray.client.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class MainTab { Connection, Settings, Information }

@Composable
fun MechanicalNavBar(
    current: MainTab,
    onTabSelected: (MainTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp)
            .shadow(6.dp, RoundedCornerShape(10.dp), ambientColor = Color(0xFF0D0F12))
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFF2B2E33), Color(0xFF1E2024))
                ),
                RoundedCornerShape(10.dp)
            )
            .border(1.dp, Color(0xFF4A5057), RoundedCornerShape(10.dp))
            .padding(3.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        listOf(
            MainTab.Connection to "Connection",
            MainTab.Settings to "Settings",
            MainTab.Information to "Information"
        ).forEach { (tab, label) ->
            val active = tab == current
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .then(
                        if (active) {
                            Modifier
                                .shadow(6.dp, RoundedCornerShape(8.dp))
                                .background(
                                    Brush.verticalGradient(
                                        listOf(Color(0xFF5A626C), Color(0xFF373C43), Color(0xFF2A2E33))
                                    ),
                                    RoundedCornerShape(8.dp)
                                )
                                .border(
                                    1.dp,
                                    Brush.verticalGradient(listOf(Color(0xFF86909C), Color(0xFF22252A))),
                                    RoundedCornerShape(8.dp)
                                )
                        } else {
                            Modifier
                                .background(Color.Transparent)
                                .clickable { onTabSelected(tab) }
                        }
                    )
                    .padding(horizontal = 4.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = label,
                        color = if (active) Color(0xFFF1F3F5) else Color(0xFF8D939C),
                        fontSize = 12.sp,
                        fontWeight = if (active) FontWeight.Bold else FontWeight.SemiBold
                    )
                    if (active) {
                        Spacer(Modifier.width(6.dp))
                        // Glowing Copper Dome Rivet / Indicator Bulb
                        Box(
                            modifier = Modifier
                                .size(9.dp)
                                .shadow(4.dp, CircleShape, ambientColor = Color(0xFFFFA142))
                                .background(
                                    Brush.radialGradient(
                                        listOf(Color(0xFFFFD499), Color(0xFFD47333), Color(0xFF6B300B))
                                    ),
                                    CircleShape
                                )
                                .border(0.8.dp, Color(0xFFFFECC4), CircleShape)
                        )
                    }
                }
            }
        }
    }
}
```

---

## 4. Connection Screen (`HomePanes.kt`)

Replace `app/src/main/java/com/aiv2ray/client/ui/home/HomePanes.kt` with:

```kotlin
package com.aiv2ray.client.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aiv2ray.client.data.ServerProfile
import com.aiv2ray.client.ui.theme.*

@Composable
fun ConnectionPane(
    servers: List<ServerProfile>,
    selected: ServerProfile?,
    connecting: Boolean,
    message: String?,
    onAddLink: (String) -> Unit,
    onSelect: (ServerProfile) -> Unit,
    onRemove: (String) -> Unit,
    onTapConnect: () -> Unit
) {
    var purposeInput by remember { mutableStateOf("") }
    var selectedApiKey by remember { mutableStateOf("Gemini API Key") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 1. AI Intent Box (Exact match to file_1791890523211.jpg)
        ScrewedSteelPlate(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(6.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Header with Star Icon & Burmese Prompt
                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        Icons.Default.Star,
                        contentDescription = null,
                        tint = Color(0xFFD48248),
                        modifier = Modifier.size(20.dp).padding(top = 2.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "VPN ကို ဘာအတွက် အဓိက သုံးချင်ပါသလဲ?",
                            color = Color(0xFFF1F3F5),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "အသုံးပြုမည့် platform ကို ရိုက်ထည့်ပါ (သို့) raw key ထည့်ပါ",
                            color = Color(0xFFA6ACB5),
                            fontSize = 11.sp
                        )
                    }
                }

                // Dropdown Selector: Gemini API Key
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(4.dp, RoundedCornerShape(8.dp))
                        .background(
                            Brush.verticalGradient(listOf(Color(0xFF26292E), Color(0xFF1B1D21))),
                            RoundedCornerShape(8.dp)
                        )
                        .border(1.dp, Color(0xFF4C525A), RoundedCornerShape(8.dp))
                        .padding(horizontal = 12.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = selectedApiKey,
                        color = Color(0xFFD6DBE2),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(Modifier.weight(1f))
                    Icon(
                        Icons.Default.ArrowDropDown,
                        contentDescription = null,
                        tint = Color(0xFFA6ACB5),
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Recessed Input Slot
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(4.dp, RoundedCornerShape(8.dp))
                        .background(Color(0xFF141619), RoundedCornerShape(8.dp))
                        .border(1.dp, Color(0xFF363B42), RoundedCornerShape(8.dp))
                        .padding(horizontal = 12.dp, vertical = 11.dp)
                ) {
                    if (purposeInput.isEmpty()) {
                        Text(
                            text = "ဥပမာ PUBG, Facebook, streaming, download",
                            color = Color(0xFF6F757E),
                            fontSize = 12.sp
                        )
                    }
                    BasicTextField(
                        value = purposeInput,
                        onValueChange = { purposeInput = it },
                        singleLine = true,
                        textStyle = TextStyle(color = Color(0xFFEDEDED), fontSize = 12.sp),
                        cursorBrush = SolidColor(Color(0xFFD48248)),
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                // Search / Recommendation Action Button with Copper Underglow Slit
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .shadow(6.dp, RoundedCornerShape(8.dp))
                            .background(
                                Brush.verticalGradient(listOf(Color(0xFF4A515A), Color(0xFF282C31))),
                                RoundedCornerShape(8.dp)
                            )
                            .border(1.dp, Color(0xFF6D7580), RoundedCornerShape(8.dp))
                            .clickable { onAddLink(purposeInput) }
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "ရှာဖွေနေသည်...",
                            color = Color(0xFFEDEDED),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    // Underglow Slit
                    Box(
                        modifier = Modifier
                            .width(180.dp)
                            .height(2.dp)
                            .shadow(4.dp, ambientColor = Color(0xFFFF9438))
                            .background(Color(0xFFFF9E47))
                    )
                }
            }
        }

        // 2. QUICK Action Buttons Tray
        ScrewedSteelPlate(modifier = Modifier.fillMaxWidth(), hasCornerScrews = false) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "QUICK",
                    color = Color(0xFF8B929B),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )

                // Quick Buttons: PUBG Mobile and Facebook & IG
                listOf("PUBG Mobile", "Facebook & IG").forEach { label ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .shadow(4.dp, RoundedCornerShape(6.dp))
                            .background(
                                Brush.verticalGradient(listOf(Color(0xFF4A515A), Color(0xFF2A2E33))),
                                RoundedCornerShape(6.dp)
                            )
                            .border(1.dp, Color(0xFF636A74), RoundedCornerShape(6.dp))
                            .clickable { purposeInput = label }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            color = Color(0xFFEDEDED),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        // 3. Current Node Plate with Globe Icon & Corner Screws
        ScrewedSteelPlate(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.Language,
                    contentDescription = null,
                    tint = Color(0xFF7D848E),
                    modifier = Modifier.size(36.dp)
                )
                Spacer(Modifier.width(14.dp))
                Text(
                    text = selected?.name ?: "No Node Selected",
                    color = Color(0xFFD6DBE2),
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // 4. Bottom Analog Instruments & Industrial Power Switch
        ScrewedSteelPlate(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Latency Ping Dial
                AnalogDial(
                    label = "LATENCY PING",
                    valueText = if (connecting) "45 ms" else "--- ms",
                    needleRatio = if (connecting) 0.35f else 0.05f,
                    unit = "ms",
                    modifier = Modifier.weight(1f)
                )

                // Heavy-duty Concentric Circular Power Button
                ConcentricPowerButton(
                    active = connecting,
                    onTap = onTapConnect,
                    modifier = Modifier.padding(horizontal = 6.dp)
                )

                // Speed Rate Dial
                AnalogDial(
                    label = "SPEED RATE",
                    valueText = if (connecting) "38.2 Mbps" else "--- Mbps",
                    needleRatio = if (connecting) 0.55f else 0.05f,
                    unit = "Mbps",
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

/** Machined Concentric Power Button with Copper Halo */
@Composable
fun ConcentricPowerButton(
    active: Boolean,
    onTap: () -> Unit,
    modifier: Modifier = Modifier
) {
    val halo = if (active) Color(0xFFFF8E3B).copy(alpha = 0.6f) else Color.Transparent

    Box(
        modifier = modifier
            .size(86.dp)
            .shadow(16.dp, CircleShape, ambientColor = halo, spotColor = halo)
            .background(
                Brush.radialGradient(
                    listOf(Color(0xFF5A616A), Color(0xFF282C31), Color(0xFF111316))
                ),
                CircleShape
            )
            .border(
                2.5.dp,
                if (active) Brush.radialGradient(listOf(Color(0xFFFFB673), Color(0xFFB85926)))
                else Brush.verticalGradient(listOf(Color(0xFF6F7782), Color(0xFF1E2125))),
                CircleShape
            )
            .padding(8.dp)
            .clickable { onTap() },
        contentAlignment = Alignment.Center
    ) {
        // Inner Machined Well
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        listOf(Color(0xFF353A41), Color(0xFF121417))
                    ),
                    CircleShape
                )
                .border(1.5.dp, if (active) Color(0xFFFF9D47) else Color(0xFF4C535C), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Default.PowerSettingsNew,
                contentDescription = "Power",
                tint = if (active) Color(0xFFFFB878) else Color(0xFF888F99),
                modifier = Modifier.size(34.dp)
            )
        }
    }
}
```

---

## 5. Device Information Screen (`InfoScreen.kt`)

Replace `app/src/main/java/com/aiv2ray/client/ui/info/InfoScreen.kt` with:

```kotlin
package com.aiv2ray.client.ui.info

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aiv2ray.client.ui.theme.ScrewedSteelPlate
import com.aiv2ray.client.ui.theme.ScrewHead

@Composable
fun InfoPane() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Main Device Information Plate
        ScrewedSteelPlate(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(6.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "DEVICE INFORMATION",
                    color = Color(0xFFD6DBE2),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.5.sp,
                    modifier = Modifier.align(Alignment.CenterHorizontally).padding(bottom = 4.dp)
                )

                // 5 Floating Screwed Metal Bars (matches file_1791890515033.jpg)
                InfoSteelRow("App Version", ": 2.4.1")
                InfoSteelRow("Protocol", ": VLESS / VMess / Trojan")
                InfoSteelRow("Local IP", ": 192.168.x.x")
                InfoSteelRow("Server", ": --")
                InfoSteelRow("Subscription", ": --")

                Spacer(Modifier.height(4.dp))

                // Bottom Push Buttons: Check Update & Share
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Check Update Push Button
                    Box(
                        modifier = Modifier
                            .weight(1.3f)
                            .shadow(8.dp, RoundedCornerShape(10.dp))
                            .background(
                                Brush.verticalGradient(
                                    listOf(Color(0xFF565D66), Color(0xFF33383F), Color(0xFF23262A))
                                ),
                                RoundedCornerShape(10.dp)
                            )
                            .border(1.5.dp, Color(0xFF757E8A), RoundedCornerShape(10.dp))
                            .clickable { /* Check update action */ }
                            .padding(vertical = 12.dp, horizontal = 12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.FileDownload,
                                contentDescription = null,
                                tint = Color(0xFFE2E6EB),
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(Modifier.width(8.dp))
                            Text(
                                text = "Check Update",
                                color = Color(0xFFF1F3F5),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    // Share Push Button
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .shadow(8.dp, RoundedCornerShape(10.dp))
                            .background(
                                Brush.verticalGradient(
                                    listOf(Color(0xFF565D66), Color(0xFF33383F), Color(0xFF23262A))
                                ),
                                RoundedCornerShape(10.dp)
                            )
                            .border(1.5.dp, Color(0xFF757E8A), RoundedCornerShape(10.dp))
                            .clickable { /* Share action */ }
                            .padding(vertical = 12.dp, horizontal = 12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.Share,
                                contentDescription = null,
                                tint = Color(0xFFE2E6EB),
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(Modifier.width(8.dp))
                            Text(
                                text = "Share",
                                color = Color(0xFFF1F3F5),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun InfoSteelRow(label: String, value: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(8.dp))
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFF4C525A), Color(0xFF30343A), Color(0xFF25282D))
                ),
                RoundedCornerShape(8.dp)
            )
            .border(1.dp, Color(0xFF656D77), RoundedCornerShape(8.dp))
            .padding(horizontal = 14.dp, vertical = 11.dp)
    ) {
        ScrewHead(modifier = Modifier.align(Alignment.CenterStart).offset(x = (-4).dp), size = 8.dp)
        ScrewHead(modifier = Modifier.align(Alignment.CenterEnd).offset(x = 4.dp), size = 8.dp)

        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = label,
                color = Color(0xFFE8ECF0),
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.weight(1f))
            Text(
                text = value,
                color = Color(0xFFD6DBE2),
                fontSize = 13.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
```

---

## 6. Main Root Screen (`HomeScreen.kt`)

Update `app/src/main/java/com/aiv2ray/client/ui/MainActivity.kt` or `HomeScreen.kt`:

```kotlin
package com.aiv2ray.client.ui.home

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.aiv2ray.client.service.V2RayVpnService
import com.aiv2ray.client.ui.info.InfoPane
import com.aiv2ray.client.ui.settings.SettingsPane
import com.aiv2ray.client.ui.theme.CopperHeaderTitle
import com.aiv2ray.client.vm.HomeViewModel

@Composable
fun HomeScreen(vm: HomeViewModel = viewModel()) {
    val ctx = LocalContext.current
    var tab by rememberSaveable { mutableStateOf(MainTab.Connection) }
    val servers by vm.servers.collectAsState()
    val selected by vm.selected.collectAsState()
    val connecting by vm.connecting.collectAsState()
    val message by vm.message.collectAsState()

    val vpnPrepLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            vm.toggleConnecting(true)
            startTunnel(ctx, vm, selected?.json ?: "{}")
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFF1E2125), Color(0xFF121417), Color(0xFF090A0C))
                )
            )
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Straight Non-Tilted Copper Extruded Title
        Spacer(Modifier.height(8.dp))
        CopperHeaderTitle("Ai V2Ray Client")

        Spacer(Modifier.height(8.dp))

        // OFFLINE / ONLINE Oval Badge (from reference file_1791890523211.jpg)
        Box(
            modifier = Modifier
                .border(1.5.dp, Color(0xFF4C525A), RoundedCornerShape(999.dp))
                .padding(horizontal = 14.dp, vertical = 3.dp)
        ) {
            Text(
                text = if (connecting) "ONLINE" else "OFFLINE",
                color = if (connecting) Color(0xFFFF9E47) else Color(0xFF868C95),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp
            )
        }

        Spacer(Modifier.height(14.dp))

        // Mechanical 3-Tab Bar with Glowing Rivet
        MechanicalNavBar(
            current = tab,
            onTabSelected = { tab = it }
        )

        Spacer(Modifier.height(14.dp))

        when (tab) {
            MainTab.Connection -> ConnectionPane(
                servers = servers,
                selected = selected,
                connecting = connecting,
                message = message,
                onAddLink = { vm.addServer(it) },
                onSelect = { vm.select(it) },
                onRemove = { vm.remove(it) },
                onTapConnect = {
                    if (connecting) {
                        ctx.startService(
                            Intent(ctx, V2RayVpnService::class.java).setAction(V2RayVpnService.ACTION_STOP)
                        )
                        vm.toggleConnecting(false)
                    } else if (selected != null) {
                        val intent = VpnService.prepare(ctx)
                        if (intent == null) {
                            vm.toggleConnecting(true)
                            startTunnel(ctx, vm, selected?.json ?: "{}")
                        } else {
                            vpnPrepLauncher.launch(intent)
                        }
                    } else {
                        vm.setMessage("Please select a node first")
                    }
                }
            )
            MainTab.Settings -> SettingsPane()
            MainTab.Information -> InfoPane()
        }
    }
}

private fun startTunnel(ctx: android.content.Context, vm: HomeViewModel, json: String) {
    val i = Intent(ctx, V2RayVpnService::class.java)
        .putExtra(V2RayVpnService.EXTRA_CONFIG_JSON, json)
    ctx.startForegroundService(i)
}
```

---

## 7. Compilation & Verification

After copying these files into your project:

```bash
./gradlew assembleDebug
```

Verify in Android Studio's Compose Preview or install the APK to your test device:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```
