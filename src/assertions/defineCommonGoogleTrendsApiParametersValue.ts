export interface CommonGoogleTrendsApiParameters {
  /**
   * the prefered language
   *
   * defaults to `en-US`
   *
   * for example:
   * - `en-US` for US english
   *
   * TODO: determine exactly how this affects search results
   */
  hl?: string;

  /**
   * the preferred timezone
   *
   * defaults to `240`
   *
   * for example:
   * - `240` for EST
   *
   * TODO: determine exactly how this affects search results
   */
  tz?: number;
}

export const defineCommonGoogleTrendsApiParametersValue = ({
  tz,
  hl,
}: CommonGoogleTrendsApiParameters) => ({
  hl: hl ?? 'en-US', // default to en-US
  tz: `${tz ?? 240}`, // default to 240; cast to string for url encoding
});
