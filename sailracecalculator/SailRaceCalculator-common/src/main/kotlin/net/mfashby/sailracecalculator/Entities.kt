package net.mfashby.sailracecalculator
/**
 * Data objects used for calculating & displaying race results
 */

data class Series(val id: Int? = null,
                  val name: String? = null,
                  val ntocount: Int? = null,
                  val weight: Int? = null)

data class Race(val id: Int? = null,
                val seriesID: Int? = null,
                val rdate: String? = null,
                val name: String? = null,
                val wholelegs: Int? = null,
                val partlegs: Int? = null,
                val ood: String? = null,
                val aood: String? = null,
                val winddir: String? = null,
                val windstr: String? = null,
                val comments: String? = null,
                val finished: Boolean = false)

data class Result(val id: Int? = null,
                  val individualID: Int? = null,
                  val nlaps: Int? = null,
                  val rtime: Long? = null,
                  val adjtime: Long? = null,
                  val posn: Int? = null,
                  val raceID: Int? = null,
                  val fleet: String? = null,
                  val crew: String? = null)

data class BoatType(val id: Int? = null,
                    val btype: String?  = null,
                    val fleet: String? = null,
                    val pyn: Int? = null)

data class Individual(val id: Int? = null,
                      val boattypeID: Int? = null,
                      val name: String? = null,
                      val boatnum: String? = null,
                      val ph: Int? = null,
                      val btype: String? = null)