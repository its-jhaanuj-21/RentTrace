package com.renttrace.app.models

data class AppSettings(
    val tenantName: String = "",
    val tenantPhone: String = "",
    val defaultHouseRent: Double = 0.0,
    val defaultElecRate: Double = 0.0,
    val defaultWaterRate: Double = 0.0,
    val initialMeterReading: Double = 0.0,
    val landlordName: String = "",
    val landlordUpi: String = "",
    val landlordDetails: String = "",
    val customServices: List<CustomService> = emptyList()
)

data class CustomService(
    val id: String = "",
    val name: String = "",
    val rate: Double = 0.0
)

data class Payment(
    val id: String,
    val month: String,
    val date: String,
    val grandTotal: Double,
    val paidAmount: Double,
    val elecAmount: Double,
    val otherAmount: Double,
    val otherCharges: List<OtherCharge> = emptyList(),
    val currMeter: Double = 0.0,
    val paymentMethod: String = "online",
    val status: String = "Paid"
)

data class OtherCharge(
    val desc: String,
    val amount: Double
)
