package com.renttrace.app.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.renttrace.app.models.Payment

@Composable
fun DashboardScreen(viewModel: DashboardViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF070A13))
            .padding(16.dp)
    ) {
        Text(
            text = "Utility Flow Overview",
            color = Color.White,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Track and summary billing details at a glance",
            color = Color.Gray,
            fontSize = 14.sp
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Stats Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                modifier = Modifier.weight(1f),
                title = "Total Paid",
                value = "₹${uiState.totalPaid}",
                iconColor = Color(0xFF6366F1)
            )
            StatCard(
                modifier = Modifier.weight(1f),
                title = "Electricity",
                value = "₹${uiState.elecTotal}",
                iconColor = Color(0xFF10B981)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Recent Payments",
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(uiState.payments) { payment ->
                PaymentItem(payment)
            }
        }
    }
}

@Composable
fun StatCard(modifier: Modifier, title: String, value: String, iconColor: Color) {
    Surface(
        modifier = modifier,
        color = Color(0xFF14141B),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF2D2D3A))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .background(iconColor.copy(alpha = 0.1f), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                // Simplified icon for now
                Box(modifier = Modifier.size(16.dp).background(iconColor))
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(text = title, color = Color.Gray, fontSize = 12.sp)
            Text(text = value, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun PaymentItem(payment: Payment) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = Color(0xFF14141B),
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF2D2D3A))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(text = payment.month, color = Color.White, fontWeight = FontWeight.Bold)
                Text(text = payment.date, color = Color.Gray, fontSize = 12.sp)
            }
            Text(
                text = "₹${payment.grandTotal}",
                color = Color(0xFF6366F1),
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        }
    }
}
