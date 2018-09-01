import net.mfashby.sailracecalculator.*
import kotlin.test.Ignore
import kotlin.test.Test
import kotlin.test.expect

class CalculatorTests {
    /**
     * Test cases for the race result calculator
     */
    @Ignore
    @Test
    fun simple2BoatRaceResult() {
        val boatTypeId = 1
        val raceId = 1
        val b1 = BoatType(id = boatTypeId, btype = "Laser", pyn = 1000, fleet = "Laser")
        val i1 = Individual(id = 1, name = "Martin", boattypeID = boatTypeId, boatnum = "12345", ph = 100, btype = "Laser")
        val i2 = Individual(id = 2, name = "Georgia", boattypeID = boatTypeId, boatnum = "45678", ph = 100, btype = "Laser")

        val r1 = Race(id = raceId, seriesID = 1, rdate = "2017-01-01")
        val e1 = Result(id = 1, raceID = raceId, individualID = i1.id, rtime = 150000)
        val e2 = Result(id = 2, raceID = raceId, individualID = i2.id, rtime = 140000)

        // e2 is the winning entry
        expect(listOf(e2.copy(adjtime = 140000, posn = 1),
                      e1.copy(adjtime = 150000, posn = 2))) {

            calculateRaceResult(race = r1,
                    results = listOf(e1, e2),
                    individuals = listOf(i1, i2),
                    boatTypes = listOf(b1))
        }
    }

    @Ignore
    @Test
    fun simpleSeriesResult() {
        val boatTypeId = 1
        val b1 = BoatType(id = boatTypeId, btype = "Laser", pyn = 1000, fleet = "Laser")
        val i1 = Individual(id = 1, name = "Martin", boattypeID = boatTypeId, boatnum = "12345", ph = 100, btype = "Laser")
        val i2 = Individual(id = 2, name = "Georgia", boattypeID = boatTypeId, boatnum = "45678", ph = 100, btype = "Laser")

        val seriesId = 1
        val s1 = Series(id = seriesId, name = "Test series", ntocount = 1, weight = 1)
        val raceId = 1
        val r1 = Race(id = raceId, seriesID = seriesId, rdate = "2017-01-01")
        val e1 = Result(id = 1, raceID = raceId, individualID = i1.id, rtime = 150000)
        val e2 = Result(id = 2, raceID = raceId, individualID = i2.id, rtime = 140000)

        // i2 has won the (very simple) series
        expect(listOf(i2, i1)) {
            calculateSeriesResult(series = s1,
                    races = listOf(r1),
                    results = listOf(e1, e2),
                    individuals = listOf(i1, i2),
                    boatTypes = listOf(b1))
        }
    }
}