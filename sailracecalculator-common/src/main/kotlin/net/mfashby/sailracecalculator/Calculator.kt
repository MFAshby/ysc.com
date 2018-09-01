package net.mfashby.sailracecalculator
/**
 * These are the main library functions to be used by other applications
 */

/**
 * Calculates the finishing positions for a particular race
 *
 * Returns a list of Result objects, with adjtime and posn
 * calculated, and sorted by position
 */
fun calculateRaceResult(race: Race,
                        results: List<Result>,
                        individuals: List<Individual>,
                        boatTypes: List<BoatType>): List<Result> {
    TODO()
}

/**
 * Calculates the series winners for a particular series.
 *
 * Returns a list of Individuals, ordered by finishing position
 */
fun calculateSeriesResult(series: Series,
                          races: List<Race>,
                          results: List<Result>,
                          individuals: List<Individual>,
                          boatTypes: List<BoatType>): List<Individual> {
    TODO()
}