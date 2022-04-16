export class MorseCountUnits {
    interCharacterSpaceCount = 0
    intraCharacterSpaceCount = 0
    ditCount = 0
    dahCount = 0
    wordSpacesCount = 0
    extraWordSpacingDitsCount = 0
}

export class MorseTimingCalculator {
    // based on https://morsecode.world/international/timing.html
    static getTimingUnits = (wpm, fwpm) => {
      const calculatedSecondsPerDit = 60 / (50 * wpm)
      const calculatedUnitsMs = calculatedSecondsPerDit * 1000
      const calculatedFWUnitSeconds = ((60 / fwpm) - 31 * calculatedSecondsPerDit) / 19
      const calculatedFWUnitsMs = calculatedFWUnitSeconds * 1000

      return {
        calculatedUnitsMs,
        calculatedFWUnitsMs,
        ditUnitMultiPlier: 1,
        dahUnitMultiplier: 3,
        intraCharacterSpaceMultiplier: 1,
        interCharacterSpaceMultiplier: 3,
        wordSpaceMultiplier: 7
      }
    }

    static countUnits = (morsecwwav, prePopulated) => {
      let cnts
      if (prePopulated) {
        cnts = prePopulated
      } else {
        cnts = new MorseCountUnits()
      }

      const morseWords = morsecwwav.morse.split('/')
      cnts.wordSpacesCount = morseWords.length - 1
      morseWords.forEach((word) => {
        const characters = word.trim().split(' ')
        cnts.interCharacterSpaceCount += characters.length - 1
        characters.forEach((character) => {
          cnts.intraCharacterSpaceCount += character.length - 1
          cnts.ditCount += character.split('').filter((x) => x === '.').length
          cnts.dahCount += character.split('').filter((x) => x === '-').length
        })
      })
      return cnts
    }

    static getTimes = (timingUnits, countUnits) => {
      const ditTime = countUnits.ditCount * timingUnits.ditUnitMultiPlier * timingUnits.calculatedUnitsMs
      const dahTime = countUnits.dahCount * timingUnits.dahUnitMultiplier * timingUnits.calculatedUnitsMs
      const intraCharacterSpaceTime = countUnits.intraCharacterSpaceCount * timingUnits.intraCharacterSpaceMultiplier * timingUnits.calculatedUnitsMs
      // these are farnsworthed
      const interCharacterSpaceTime = countUnits.interCharacterSpaceCount * timingUnits.interCharacterSpaceMultiplier * timingUnits.calculatedFWUnitsMs
      const wordSpaceTime = countUnits.wordSpacesCount * timingUnits.wordSpaceMultiplier * timingUnits.calculatedFWUnitsMs
      const extraWordSpacingDitsTime = countUnits.wordSpacesCount * countUnits.extraWordSpacingDitsCount * timingUnits.ditUnitMultiPlier * timingUnits.calculatedFWUnitsMs

      const totalTime = ditTime + dahTime + intraCharacterSpaceTime + interCharacterSpaceTime + wordSpaceTime + extraWordSpacingDitsTime

      // single wordspace
      const singleWordSpaceTime = timingUnits.wordSpaceMultiplier * timingUnits.calculatedFWUnitsMs + countUnits.extraWordSpacingDitsCount * timingUnits.ditUnitMultiPlier * timingUnits.calculatedFWUnitsMs
      const totalPlusTrail = totalTime + singleWordSpaceTime
      return { totalTime, ditTime, dahTime, intraCharacterSpaceTime, interCharacterSpaceTime, wordSpaceTime, extraWordSpacingDitsTime, singleWordSpaceTime, totalPlusTrail }
    }
}
