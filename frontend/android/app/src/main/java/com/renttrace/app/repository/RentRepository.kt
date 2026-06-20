package com.renttrace.app.repository

import com.renttrace.app.api.RentTraceService
import com.renttrace.app.models.AppSettings
import com.renttrace.app.models.Payment
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class RentRepository(private val service: RentTraceService) {
    fun getSettings(token: String): Flow<AppSettings> = flow {
        emit(service.getSettings("Bearer $token"))
    }

    fun getPayments(token: String): Flow<List<Payment>> = flow {
        emit(service.getPayments("Bearer $token"))
    }
}
