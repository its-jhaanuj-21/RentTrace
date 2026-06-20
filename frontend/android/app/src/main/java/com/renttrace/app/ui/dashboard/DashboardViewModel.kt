package com.renttrace.app.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.renttrace.app.models.AppSettings
import com.renttrace.app.models.Payment
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class DashboardUiState(
    val payments: List<Payment> = emptyList(),
    val settings: AppSettings = AppSettings(),
    val isLoading: Boolean = false,
    val totalPaid: Double = 0.0,
    val elecTotal: Double = 0.0,
    val otherTotal: Double = 0.0
)

class DashboardViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    init {
        loadMockData()
    }

    private fun loadMockData() {
        val mockPayments = listOf(
            Payment("1", "2025-02", "2025-02-01", 5500.0, 5500.0, 450.0, 100.0, emptyList(), 1250.0),
            Payment("2", "2025-01", "2025-01-01", 5400.0, 5400.0, 400.0, 100.0, emptyList(), 1200.0),
            Payment("3", "2024-12", "2024-12-01", 5600.0, 5600.0, 500.0, 150.0, emptyList(), 1150.0)
        )
        
        _uiState.update { 
            it.copy(
                payments = mockPayments,
                totalPaid = mockPayments.sumOf { p -> p.paidAmount },
                elecTotal = mockPayments.sumOf { p -> p.elecAmount },
                otherTotal = mockPayments.sumOf { p -> p.otherAmount }
            )
        }
    }
}
