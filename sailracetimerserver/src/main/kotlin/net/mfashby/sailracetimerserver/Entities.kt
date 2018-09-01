package net.mfashby.sailracetimerserver
import io.ktor.auth.Principal

data class User(val id: Int? = null,
                val name: String,
                val password: String,
                val level: Int): Principal
