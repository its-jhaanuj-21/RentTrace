package com.renttrace.app.api

import com.renttrace.app.models.AppSettings
import com.renttrace.app.models.Payment
import retrofit2.http.GET
import retrofit2.http.Header

interface RentTraceService {
    @GET("settings")
    suspend fun getSettings(@Header("Authorization") token: String): AppSettings

    @GET("payments")
    suspend fun getPayments(@Header("Authorization") token: String): List<Payment>
}
