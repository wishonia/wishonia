/**
 * Decentralized FDA API
 * A platform for quantifying the effects of every drug, supplement, food, and other factor on your health.
 *
 * OpenAPI spec version: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export class StudyText {
  /**
   * Ex: Overall Mood is 3.55/5 (15% higher) on average after days with around 4.19/5 Sleep Quality
   */
  "averageEffectFollowingHighCauseExplanation"?: string
  /**
   * Ex: Overall Mood is 2.65/5 (14% lower) on average after days with around 1.97/5 Sleep Quality
   */
  "averageEffectFollowingLowCauseExplanation"?: string
  /**
   * Ex: Overall Mood, on average, 17% higher after around 4.14/5 Sleep Quality
   */
  "valuePredictingHighOutcomeExplanation"?: string
  /**
   * Ex: Overall Mood, on average, 11% lower after around 3.03/5 Sleep Quality
   */
  "valuePredictingLowOutcomeExplanation"?: string
  /**
   * Ex: It was assumed that 0 hours would pass before a change in Very Distracting Time would produce an observable change in Video Activities.  It was assumed that Very Distracting Time could produce an observable change in Video Activities for as much as 7 days after the stimulus event.
   */
  "dataAnalysis"?: string
  /**
   * Ex: Very Distracting Time data was primarily collected using <a href=\"https://www.rescuetime.com/rp/curedao/plans\">RescueTime</a>. Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs.<br>Video Activities data was primarily collected using <a href=\"https://www.rescuetime.com/rp/curedao/plans\">RescueTime</a>. Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs.
   */
  "dataSources"?: string
  /**
   * Ex: Very Distracting Time data was primarily collected using <a href=\"https://www.rescuetime.com/rp/curedao/plans\">RescueTime</a>. Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs.<br>Video Activities data was primarily collected using <a href=\"https://www.rescuetime.com/rp/curedao/plans\">RescueTime</a>. Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs.
   */
  "dataSourcesParagraphForCause"?: string
  /**
   * Ex: Very Distracting Time data was primarily collected using <a href=\"https://www.rescuetime.com/rp/curedao/plans\">RescueTime</a>. Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs.<br>Video Activities data was primarily collected using <a href=\"https://www.rescuetime.com/rp/curedao/plans\">RescueTime</a>. Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs.
   */
  "dataSourcesParagraphForEffect"?: string
  /**
   * Ex: Sleep Quality Predicts Higher Overall Mood
   */
  "lastCauseDailyValueSentenceExtended"?: string
  /**
   * Ex: Sleep Quality Predicts Higher Overall Mood
   */
  "lastCauseAndOptimalValueSentence"?: string
  /**
   * Ex: Sleep Quality Predicts Higher Overall Mood
   */
  "lastCauseDailyValueSentence"?: string
  /**
   * Ex: Sleep Quality Predicts Higher Overall Mood
   */
  "optimalDailyValueSentence"?: string
  /**
   * Instructions for study participation
   */
  "participantInstructions"?: string
  /**
   * Ex: Sleep Quality Predicts Higher Overall Mood
   */
  "predictorExplanation"?: string
  /**
   * Ex: Using a two-tailed t-test with alpha = 0.05, it was determined that the change in Video Activities is statistically significant at 95% confidence interval.
   */
  "significanceExplanation"?: string
  /**
   * Ex: Aggregated data from 21 suggests with a low degree of confidence (p=0.097) that Very Distracting Time has a moderately positive predictive relationship (R=0.354) with Video Activities  (Activity).  The highest quartile of Video Activities measurements were observed following an average 2.03h Very Distracting Timeper day.  The lowest quartile of Video Activities  measurements were observed following an average 1.04h Very Distracting Timeper day.
   */
  "studyAbstract": string
  /**
   * Ex: This study is based on data donated by  21 CureDAO users. Thus, the study design is equivalent to the aggregation of 21 separate n=1 observational natural experiments.
   */
  "studyDesign": string
  /**
   * Ex: As with any human experiment, it was impossible to control for all potentially confounding variables.             Correlation does not necessarily imply correlation.  We can never know for sure if one factor is definitely the cause of an outcome.             However, lack of correlation definitely implies the lack of a causal relationship.  Hence, we can with great             confidence rule out non-existent relationships. For instance, if we discover no relationship between mood             and an antidepressant this information is just as or even more valuable than the discovery that there is a relationship.             <br>             <br>             We can also take advantage of several characteristics of time series data from many subjects  to infer the likelihood of a causal relationship if we do find a correlational relationship.             The criteria for causation are a group of minimal conditions necessary to provide adequate evidence of a causal relationship between an incidence and a possible consequence.             The list of the criteria is as follows:             <br>             1. Strength (effect size): A small association does not mean that there is not a causal effect, though the larger the association, the more likely that it is causal.             <br>             2. Consistency (reproducibility): Consistent findings observed by different persons in different places with different samples strengthens the likelihood of an effect.             <br>             3. Specificity: Causation is likely if a very specific population at a specific site and disease with no other likely explanation. The more specific an association between a factor and an effect is, the bigger the probability of a causal relationship.             <br>             4. Temporality: The effect has to occur after the cause (and if there is an expected delay between the cause and expected effect, then the effect must occur after that delay).             <br>             5. Biological gradient: Greater exposure should generally lead to greater incidence of the effect. However, in some cases, the mere presence of the factor can trigger the effect. In other cases, an inverse proportion is observed: greater exposure leads to lower incidence.             <br>             6. Plausibility: A plausible mechanism between cause and effect is helpful.             <br>             7. Coherence: Coherence between epidemiological and laboratory findings increases the likelihood of an effect.             <br>             8. Experiment: \"Occasionally it is possible to appeal to experimental evidence\".             <br>             9. Analogy: The effect of similar factors may be considered.             <br>             <br>              The confidence in a causal relationship is bolstered by the fact that time-precedence was taken into account in all calculations. Furthermore, in accordance with the law of large numbers (LLN), the predictive power and accuracy of these results will continually grow over time.  146 paired data points were used in this analysis.   Assuming that the relationship is merely coincidental, as the participant independently modifies their Very Distracting Time values, the observed strength of the relationship will decline until it is below the threshold of significance.  To it another way, in the case that we do find a spurious correlation, suggesting that banana intake improves mood for instance,             one will likely increase their banana intake.  Due to the fact that this correlation is spurious, it is unlikely             that you will see a continued and persistent corresponding increase in mood.  So over time, the spurious correlation will             naturally dissipate.Furthermore, it will be very enlightening to aggregate this data with the data from other participants  with similar genetic, diseasomic, environmentomic, and demographic profiles.
   */
  "studyLimitations": string
  /**
   * Ex: The objective of this study is to determine the nature of the relationship (if any) between the Very Distracting Time and the Video Activities. Additionally, we attempt to determine the Very Distracting Time values most likely to produce optimal Video Activities values.
   */
  "studyObjective": string
  /**
   * Ex: This analysis suggests that higher Very Distracting Time generally predicts negative Video Activities (p = 0.097). Video Activities is, on average, 36%  higher after around 2.03 Very Distracting Time.  After an onset delay of 168 hours, Video Activities is, on average, 16%  lower than its average over the 168 hours following around 1.04 Very Distracting Time.  146 data points were used in this analysis.  The value for Very Distracting Time changed 2984 times, effectively running 1492 separate natural experiments. The top quartile outcome values are preceded by an average 2.03 h of Very Distracting Time.  The bottom quartile outcome values are preceded by an average 1.04 h of Very Distracting Time.  Forward Pearson User Variable Relationship Coefficient was 0.354 (p=0.097, 95% CI -0.437 to 1.144 onset delay = 0 hours, duration of action = 168 hours) .  The Reverse Pearson User Variable Relationship Coefficient was 0.208 (P=0.097, 95% CI -0.583 to 0.998, onset delay = -0 hours, duration of action = -168 hours). When the Very Distracting Time value is closer to 2.03 h than 1.04 h, the Video Activities value which follows is, on average, 36% percent higher than its typical value.  When the Very Distracting Time value is closer to 1.04 h than 2.03 h, the Video Activities value which follows is 0% lower than its typical value.  Video Activities is 5 h (67% higher) on average after days with around 5 h Very Distracting Time
   */
  "studyResults": string
  /**
   * Ex: N1 Study: Very Distracting Time Predicts Negative Video Activities
   */
  "studyTitle": string
  /**
   * Help us determine if Remeron affects Overall Mood!
   */
  "studyInvitation"?: string
  /**
   * Does Remeron affect Overall Mood?
   */
  "studyQuestion"?: string
  /**
   * In order to reduce suffering through the advancement of human knowledge...
   */
  "studyBackground"?: string
  /**
   * Ex: Sleep Quality Predicts Higher Overall Mood
   */
  "tagLine"?: string

  static readonly discriminator: string | undefined = undefined

  static readonly attributeTypeMap: Array<{
    name: string
    baseName: string
    type: string
    format: string
  }> = [
    {
      name: "averageEffectFollowingHighCauseExplanation",
      baseName: "averageEffectFollowingHighCauseExplanation",
      type: "string",
      format: "",
    },
    {
      name: "averageEffectFollowingLowCauseExplanation",
      baseName: "averageEffectFollowingLowCauseExplanation",
      type: "string",
      format: "",
    },
    {
      name: "valuePredictingHighOutcomeExplanation",
      baseName: "valuePredictingHighOutcomeExplanation",
      type: "string",
      format: "",
    },
    {
      name: "valuePredictingLowOutcomeExplanation",
      baseName: "valuePredictingLowOutcomeExplanation",
      type: "string",
      format: "",
    },
    {
      name: "dataAnalysis",
      baseName: "dataAnalysis",
      type: "string",
      format: "",
    },
    {
      name: "dataSources",
      baseName: "dataSources",
      type: "string",
      format: "",
    },
    {
      name: "dataSourcesParagraphForCause",
      baseName: "dataSourcesParagraphForCause",
      type: "string",
      format: "",
    },
    {
      name: "dataSourcesParagraphForEffect",
      baseName: "dataSourcesParagraphForEffect",
      type: "string",
      format: "",
    },
    {
      name: "lastCauseDailyValueSentenceExtended",
      baseName: "lastCauseDailyValueSentenceExtended",
      type: "string",
      format: "",
    },
    {
      name: "lastCauseAndOptimalValueSentence",
      baseName: "lastCauseAndOptimalValueSentence",
      type: "string",
      format: "",
    },
    {
      name: "lastCauseDailyValueSentence",
      baseName: "lastCauseDailyValueSentence",
      type: "string",
      format: "",
    },
    {
      name: "optimalDailyValueSentence",
      baseName: "optimalDailyValueSentence",
      type: "string",
      format: "",
    },
    {
      name: "participantInstructions",
      baseName: "participantInstructions",
      type: "string",
      format: "",
    },
    {
      name: "predictorExplanation",
      baseName: "predictorExplanation",
      type: "string",
      format: "",
    },
    {
      name: "significanceExplanation",
      baseName: "significanceExplanation",
      type: "string",
      format: "",
    },
    {
      name: "studyAbstract",
      baseName: "studyAbstract",
      type: "string",
      format: "",
    },
    {
      name: "studyDesign",
      baseName: "studyDesign",
      type: "string",
      format: "",
    },
    {
      name: "studyLimitations",
      baseName: "studyLimitations",
      type: "string",
      format: "",
    },
    {
      name: "studyObjective",
      baseName: "studyObjective",
      type: "string",
      format: "",
    },
    {
      name: "studyResults",
      baseName: "studyResults",
      type: "string",
      format: "",
    },
    {
      name: "studyTitle",
      baseName: "studyTitle",
      type: "string",
      format: "",
    },
    {
      name: "studyInvitation",
      baseName: "studyInvitation",
      type: "string",
      format: "",
    },
    {
      name: "studyQuestion",
      baseName: "studyQuestion",
      type: "string",
      format: "",
    },
    {
      name: "studyBackground",
      baseName: "studyBackground",
      type: "string",
      format: "",
    },
    {
      name: "tagLine",
      baseName: "tagLine",
      type: "string",
      format: "",
    },
    {
      name: "description",
      baseName: "description",
      type: "string",
      format: "",
    },
  ]

  static getAttributeTypeMap() {
    return StudyText.attributeTypeMap
  }

  public constructor() {}
}
