# Download all slides from Google Drive
# Each program's slides are downloaded to their respective folders

$baseUrl = "https://drive.google.com/uc?export=download&id="
$basePath = "C:\Users\Victor\Desktop\Projetos\avantik\avantik\seu-evento-pronto"

$programs = @{
  "empreender" = @(
    "1n-9Omlnh2dB6XA02GlrNeqa6a2F6_wPl","1sbCkNi8F6J3ecybwc_EPSGNEIC7g89O7","1QZPcvTYiwd4Fbw4F7wbR71HGOwV5jL6v","1uUGtZ1bOB-dhpkU7rSyZacRH8Jgidwx6","1iR2GZxm5mwK6jVjpitC3mTCpfNNkEW7_","1Rq1k91bU2lATrM9m-lAHD2LRbUgbB1gI","1QNjv_kpM_Rdi1KRDhyjng4CFXXf3Ub2m","1Y3X7m_cfoPR-ZwIUb8Gn6CQnG9JBDeUT","1QtR5FuzU4uL2TVJpS5T2rYWJYmiQikUf","1uVISTkoD3uUc1XPBh7SfbeoQ0wWRLZAA","16IPJqQnEm2S-OyCZzGyRfEVeMfWdo6VP","1NY3dtsF8Km70tgOVHCMt0veyDMbYeFCP","1aP8P3yZD2zPZbk5hTLEklmR7Cym5HSPn","15PJ2jl4TIDBKQpSTB4uCJsRg-OLtl2xn","1JInhjJPzMwSiZh1G8iIoZol89kr4MvIC","1viEkZxH4k_LHQWo08aD27aWJe2IbkZtm","1yQKwxlF65YMF40EtNtVnzi6qxmc_3OL5","1uiAoFrXqpwSwaZWegg-lgFCev6eEEYfm","11iQWK_Ft0c2hip_kqVwrx1eyz4WKG29s","1RQZzERFHOIc_-YiRQKcWHnPvfJjigWVp","10AhtlgNh0hanPXWNC9iGPsnL3iXwElHG","1CBKaIJ8WgWBDjUOc0AKKFX3fazdWYRjk","1_aGWd2px8hTTfCmwp_aApSAOavutYSEa","16rwZwVEPiIXngtyWTBxZ0mRyhXs7VBSA","1JaYZFw9RkeGU8qNgQGRLKX9x9cR2Uy47","1tx8TcHTfbbgfBk684Z1bPE1SUd6C2_0v","1REs3d3c3OC016WvxkJZ1S4JlTENIAHk4","1_tGpe8F-I_KdVhrfRlCegXGJEIIz5Kjf","1YTkZ5wb9ZBDmrMCWVONCoq6wcAgzErvG","1AbaXj2PgxOr8jW0AELWQTDhpGHmVcW5Q","1A5HbsYPOApJRY5PRb4F_4QqbyEw9kE8c","1U-qcf0KD2Q-lT4c_S8t3AKolIdH73P7u","1R_oOfkmfRq74ePXeXEQNw-g95Iowz_JH","1LsDxRFvP2kX5OXpYLTANf4RoIvjjL5KZ","1NxMc0ygDAAVRO788uUQm8JnLbriGzacI","1OrcDqssaRvwqXYxRZazu9g7nDxxibkRK","15G-XJLreCUSAOaHg6SGSVZF4MzNsZhrs","1tKfVuqUBXEQaTDTQLKqG4NlwQ4UidiM7","1rOajlhdmtNKLx0J_ocHEg5LbLemW-wt5","1lIn14QKiz77f84H2OTwS1N5xFl4gquaA","1yoPNHuI0BTta6SSm91x3RJz745xNu5yQ","1At8XwGnyv6nZe7S7lDleWzytdrEsbb1D","1BEe_xjqrnaX0rlV550mbW8wa7oynEnWk","1TXFKCiP3mRVPUY0fncqoBHeuwApMAsmZ","1tcUukP0C1QjeLO0N9zz9755xgN6fApap","1Fafth1O0mKkyGFYz-QLpSup623bkmd3l","1CbqRN8zbgcPaxxGYpLjghKp6hH_JqPxB"
  )
  "gestao" = @(
    "1ni1Dn2xvtgpcHB6viFN3jsZBzNrhLpWD","1ymP36PEovwW6QzPnGL4lgrjSm_K19NLe","13XvwVA0OvfcloN7nfG7VWugCoANKyiUm","1WIfEunEp6y0tAu2pEYK_pnpy1b0X22ae","1bzRIJoS3DhRMyJavTPi4s8ivpixP1B9y","1bQNkpSsFrazBfwgXXkUhGe5mZYArKNGr","1XjmGWBAJgN68DJ12Nj8adPWuLuoe8Jfd","1AlSTWR5-vkO2uarq8pi-3oYs7MoGUq1D","1xXLSiBJMCtn_PWEopaa_XmI7K0Aw-1Tk","117-NzxXd3WAdWB83OrbJ18Q4TcvsQVNj","1sCBL0RRp6fvyG4SeTBKWcGElU_XPYWq1","1eyLeKCocWr5-LZlLNnJGcJvgpHMJZ2nm","11YyD0EDDyhb8JCH9OU_NOlPk9qM69MNY","1o5pH0-FZGj0-HHoPelKULLGl_p1vRt6y","1OT9RLNRGFXubLRdJ_ZJNL5-m0H4FDGtD","1tyavQbnIMMLnA-QVrm3TTE7YuSPmqSlN","1tu1aveinQ31lLOtMfdJ0hfqU02R6WTL7","19dMdi5vNmYz1pgAUC5ySM1NnQUOT51Tw","1lcGlhhYut1H9UDx9rksTenjogSjN7p9U","1Axr_Y7e-jZ6N3HkWaT10NkWrunVVWiTG","1tVAPbcFOVobVvE0xiPVBs_I2tWbNjRCz","1fu4UjQpkGji7jYIRKMbzJ3rk3NwwotlG","16kt8V7BaP-cwQOXMfgL_wHpXi_kqXQlA","1AD87icM3Fdqyf42KYpRYlMWscMGH1T_G","1acZjAnY5gcPlDSVknDg3ZOZE-WdBsVfO","1eZHENqiz-m0Ez_oAzDJ5fV6LsH0WoUEC","1v5a97l4X-RryGuO2_bKvHtkkbEy2pcG7","1WD2Lrf-LvSiM9I7Vz1mZqcra-X0pean7","1WQekFu-7kwk4H9MmCIwR8EPAu4h6vMEj","1Q9Ni1O5U9mbH_LwJd-txtF8x3ZOMqLfo","183Ny2y8vwFi0F-J9k347v6rCp1Peh6Vs","1bQ5zup27jyGwsrbfQCgRrKlbjh9Xg0qR","1qd58Mbkun_4DK25q7FxFK8per9TSUIN7","1busJXPTCBw0Fk2DxhfuBE_bbXS6gv7Pp","1LIbvjJ7v0eVlsojThKl7yjycdtZM-JNk","1IvV4wa7MZIukh66Ou7dovpRyFwuw8Hx0","167ViikHSHi0vvWSegU6tdnAppzG5-YER","1j8TwH7LR-aVaQ5pdCUW4lnII658Nc4SQ","1KTiopwWAmiUvSivMFBJBO2NS3Tal7J7H","1TnYJ2SFY9lY260cXWcxiA2thY7ShkjqQ","1heRSEAXgsmFROaT47SnPijlZEvvIyrcw","1J4s1Uai3leuBL6iDFTjDrTTpqYPI4Pn8","1baUOi3vehtdYFirt_qaoMehWnyb5K_q_","1LdFcPMmlr3fDalJYWlV6EcFcKYfIVTFY","15VMwGYzvJaAxPniNQJiKwLiOX2IgRGc-","1li5bLjTRCbRm_qfnRhcB-k0yW3gO5Jzf"
  )
  "inteligencia-emocional" = @(
    "12-GMqt7eE1v_cH7D53XX_Yg_ZYaIZZK1","1lRd-kPlLusroD-KUYEvQikyG2d-pjGhy","1dXsGCdsfp-ZjVCgvpujqS0U0ZQlc0Ahc","15ZkVrHWRDRtV4uI_tmshw0Cm39T-Mu7L","1u8wZBsscYrKSJHmyiR3dL_ZcAQwjTuQ0","1BZItuZCOzxtM1IKvyKwv1zzF_eT5pQPL","18gv-qQvlutp_X-H_iHApIAPKzLtdqRiu","1lw_JwaVQmj7T_FqAHplsYuIN07wqzzwO","1gM15zc7hS3RENctJPld43gpF8YJiXVpv","1jo3DNegeksrqAO9kDVvMydLn88bYtWuX","1P0JSnvKINZldu18M5XBvgbHdoU_9Ek-F","1tEQuGy4fk8XhmgkBmTv9-izJxRxY9TrS","1ydc0XXBAM2Y0BYlqW_rgNem9iksFI4jV","1VXdJ3UspkWWvVRmIlW-zOfESsCTvjrP0","1VzecWdMwcfwwsUL3odA4Yd6eJaQND5NB","1miQyr80ZAgNSwKMTIZtRLwzZQ3ncIZ4a","1P2i1C7yGpDAtE7H2dOmraupfJJExrqeD","1s9Odp7myEdDPKuaSGTW77_cMjnlsGMwk","1A1phuthSqjAQ1c23MPt_vGdrzpl51owq","1OYEYBOno0l92dJ9Yr8P37ERUCWcH0B8u","1Ard5EDKXsEUyLb_HtIc67CI13rv-b1O7","1aZa9cBZVERx3b_tVA-t6inSn-l8GWi0L","1MjUwpiFLA8KzikRSQmhxrUrnQk5DTvw2","1XS_qj5hEAW089WAqV_iv7Uz-SrWJRH3-","1sBJb2HUwqGW_FDxrGLzMcuaD3ZrJDC96","1BWiuUEnwFodairfONsOHHzt5Y2bpoENx","1ED0tJRyD14HDVuUM0vy8_DHlBXYIxmlm","14YUJQx1MTi1xzRDUvkt919gXO0BDysXH","1YOV4HAn5qpszhM42KNI961PXlzPKHbcH","1ZLjmJ75C7GpkvGYsR16fQqXFMWRpymJF","1vcOhuevkFdk2L7DNaxL0fJr893Z4FSO-","1EdSLMC0cHYeGKp0ZPNOV6euZQ4mzQlAB","1rT52uvHOZSGnDs15GnICELqDWJrJdDAA","1kdYwmk7tqyNZJphYLV1a8h3byVaadxFU","1of0zffLSPFUT1pgagsgz0FhpJnLsOBrF","1HjHYjZJUosn-roYPNSAr6s-TqasOISFK","1BFJRuvmxOKhVZKtCzPccZlys8fXbctNW","1y2Gx4FzCmX9SqORn9zBqJzSDerwsDQ2-","1yT9RR7702qanRbRGkH8gMumt03JKfnXr","1gHShDv7H5Jv8VCqkH5dSM2OQc_F9X8fL","19yz3SbYaBIWCg0Aiusz-i6kzTpkwuSIJ","1KpOtK2Qj41q5noQGJA-OMPxlVNVurTCW","1VY_-oyqNWpdw6ddT9DJmTJ1rzRHLnnRk","1CjZ-RHqyqgLdioag_EI33K7z6TUuttGl","1_MOZSlW4_qYgymLq1gBnZ9JmPcm3aC76","1NY2k4YSjBNrQOxQhyTiitA7Us6eh5W9o"
  )
  "lideranca" = @(
    "1Wu6VZTi-Tcm9MVFqRE3o6pns-EV1OX2S","1PMdNUOjievAwqw-jxDUuuC1-Ycf3wZho","1JAxXLqRczS_7QfC_I2VGNDWumDRc2lIR","1GZWQj4jNf-wtLM2cOs0Dk5BZoRqvGErO","1YlswUleYpu4fThWYg-26rY-tr4ox1x5F","14_08F7XS6ULPI_lOPigB_bjj6SubI9gQ","1LI4K_zm93Kdd8UKnx0DTRZXk_KKN1OiY","1hN_Uaj1J8SZQ-yim84JjIQZm2GiB8F1N","1SLPJ_XzF3YteILz9IdEJBQhlll3kupG5","1Yh9Lz5Al4P7vyDL3NodPLZvccmhkdfSl","1D2yJpFgqBiOZBhmcqBkXx6Klv3v2aCCY","1y1U5WaMpRfw3JIOHYEFQnuJh8KD4D0NV","1evNDNxBNeKhpHqakkC_ticUS74CEliYm","18043VW0VSzrV19EgVC-ZlpLSJwlgMAZ2","1LGfpoSutvvbKD5GfaWDGkpZDFpW2KSnd","1QPwebdZtUec3gVW5AR_4yuA2xC68pcgd","1MKsj5gnEfIQkq1gEmTdOrSxY46gOl90s","13xvZzJ6wHL0KxG2igW8b_zYF_hl0p0L4","1N7LUh0EmqRbDpkT9F97bxXv-JqqJ8--R","1pEDoyNxhDM0GW2KaGdfZigxOvrv3v0By","18_bggIaiAbxfO8z_qDpMXRnU3Zvac7cQ","1z9WeGA5hXZREUONince6Qz7XwtrY_O1f","1zuVjU9M_35t7kkpWnFz-rrhuwsxzbKgf","1HZpiQ_UvGTn4uJlpZs1Y4_Urv0fPuI4f","13xM2C7xLvRB6-GTDziY45T7N18uv_lng","1MgFeusHvXK4JrTNRNUCBQz1N5cI393wh","1COFFyM-4P4lvIbcAfD2lpNdyPliX4r83","1sxGKAVqF5-Wu-RzVRsKPJmBwF1AOiW6Q","1wRBmsIGbch_bquLMX40j0PRkajPT5K8y","1J0bl7hVSU3_76_03O68dVkmRXR3Eaauh","1XVkmvtDX-plilbQB0JINkzmtrHhWLwhX","1esLmBHNbzv_7R4MChMUj4E2Q53DGdMyN","12BZIU4xqv-5TdHzWnffk0QqT-nDzXOnG","10zgm5G2uByQv06E3B1mCw_WhuSFT_VT-","1TFoyKBkFZmzjmc2BUmMOEFPNjyMMcz0w","1a--c12Iv4xZYxwrVEyKwuOz4UXMIgYiN","1UlWc3Vcv5Fxvzl15inRlRMSSri8W5i4y","1WvO3K9e9c3i-oBA6ShD2mkLTpB_raAKu","1zojbg5OZQnQfuo77N4wsFdKkV8qF-Ad2","1go_3wObQkRR2zG42QDSS_xnhepstruq2","1a5dWfouF2hy_25QBZV_eLGb9CGBFpf5a","1Y9WsN4ZTUIHiTQXviiOqqIbUoR1fdvdD","15GLgnAfRoOPVguXMo03TT1cQWw2FqFVv","1fWdXeZWCZGAWsZjUupOf7TPG4q3rQDOJ"
  )
  "oratoria" = @(
    "1kyTEMMZ-GwEk4w_zgr9GvkTmPsoj8q27","1VcBUbOa52X-OjMY_0Vsuv6WVhx9U27f7","1oQjZNFqP8fXbk08LoCmXd-qliFIsM3At","1A0WA2fPUzYJuKhqQ-AXRkKN34F2NnaDS","1nSHajHqsZgm8je_stHcQSrh3MQvTr4Z6","16pZXNZCHJJpCFAMXjncjKaIPhkE84F8U","1TVz_Qp0BCdzAPY2kVDdsNSDK_hqqwGLe","1N7kYGHlYs_dpuRNIjg5F6dsyjG1kaaJn","1r4M_ZTbhsAJKSQ7cevB35NkhnS--iWNR","1cbdxZCPbttP7LRKn0mVdLvZ4RpEcjrNO","17Ul6er5qmaZoVuD9WHTtnLj0IeWqsLPD","1_mKYpaeWVKvQWnMuKI_s9ulh2VK9zXJy","1awRU5PHEpUn8CH3k4g2BdXD0e1IMd4oo","1ei4HgDFTf8X9rVgM2nONQKuqT4sIOkll","1-f0HhBjMPCdjnnvd3Trti1mo-duDDw5W","17Y6nMhueqEd-EcSHhSNTNwe0OkBfTH4m","1riLVCoF6awOXmRMJ6UE8wTzMapsCd-M6","1S6-36BU7XcSVWJJOVxSTxtq-qGge9gMt","1AzBPneukg6YD3qZIFPgyd-zNSa4HkHkN","152ED4pUCArBRWkSrl6BFecLKnKlJibXw","1M-_9wZREWnbFEg5LVo-bxsQthGbvXCkP","1ew6p5UdpTTYzab93AJ5MKUqO19IL0ufQ","1FhyZas5Qj9wDM3a4aEKXZw09FRqLx6sY","1rL_aQGyi9g6MUp4xQ52B1zAISlvQ-P0I","1OP1m35rrh_vF1oKeDL-hvJ8eZpGc-fn2","1eTpD4lgwOloIigEonXYs8kYDNwjIAFOy","1PMPIC8M7oXKEg5B10lfNMMNYDEF2ZMa9","1vwxIAweWKCHnAAE7U1OslHeux5cTbTZT","1VaKO5HsroFjB4eUXQznrpFpQp4y6S4WI","1PGnQtz1fmmajSHc7f8rzYz2csDOt9zCB","1G1lK9enF4_rFR_J91tcWqmmVxFNomTVi","16uovkQooUo7vjf5mazsVVcuVuhQPnPR7","1yzXSJg5NKuka3T8TUY03TN9aBjELwFze","1hjQYW8ZKvZF46OmWIfpL-biE6l9maBNr","15WxHlpiSCJKITCo_zS0jJj4JhQtye0OG","18QryA7GWAHMx2kwQCMBSEjbSGJOcEzxU","1cRQaiKi-nDQTX-MGx3H7KeSQTQ_u9v9E","1RtFKpkCUtLYQLw1-KpUengNzlR6icMKe","1QHRJA8_CLeqFGI9LJ2rToH1tsfwFjQPR","1HIo_z9BMhDAHaIp3Pju6hYn60Hrwwvkz","1jHxLYPmUJAJyDw5xkuyXdvygKH8k-U5A","158qcgkmnf8jXg0lWwRwwIQAnLU2Xt1HE","11Xo43RhzCPa6NufxmtQsJKvvHyxv_h0G"
  )
  "vendas" = @(
    "1WJK_sCzte10ihyLkCAEfpXt4g3duiMHT","1X2cIXe6PsjNbK6lo00zA6oIqbFTUNtOL","1xh-1UA4cWonWpSronVKVb7DgSYd59-DG","16voObZ3qnWnOQJvyby5C7rEHKAi00QGo","1_9quO4nVLO5KXqPk6HgxEEu3GIss98fP","1UoDUCzvyZuPL2Cu_B5b9cVuPeNToSeNw","1vXuH0U8LYPk52fMir0X2aEbqaAhboNCd","1LdBg2pmGUp1KkfGG5-GUzSOLcazEaZBE","1vdu3CAKuGYY7WX8rnQ_qXYXzgngqIJf0","1O6cskDbvpGHN1WyNxYuFq_GwgMSaENV4","1Pgkgaa0hoKHhlJbuBuLeiZMcEaTyOlj8","1nb3GZHV8c7zz_B4ZS4AFgjZxet1PpUXW","1XyBhXVYeDPFys8oUXQiS3srJ0MJjSX-w","17lO8JNg_DJuuUdCdJSsV7iAuhkGU4LaY","1EWgKEgk_p3jv0FFrAywTspHqFAX1OE9H","1iRMl6C78TMacd25CNjjEaUIVVTgv2mz0","1o5S4a4dhLKImPIJUMI-QEk52I6mvJ37h","1i_c_V4hS7Y7UcBaaqydIaQ4PQiwMurO5","1iaGbyMt8qjLtxG7J7AtvQy39KIjOILk7","1UTEjuhXOdOPzTOxvTvhem4Jwwx7I06Go","1X4Kbp3UCcGuSXuN7pLoEYsNP_PDro1ax","1FNu5YCS7CA-ktDEYh6itZXyWqOyK-Kfg","1FcDstAb83kFRruLCf26der-xJe0zYnL5","1Q-_4V0yrd_eeILU5Q2ErwcBO587UG-r1","1NTnHiUemvj33l6EsC6Uh0JXtxHOQutFU","1TsVHcTE6X1vYwT0ZRbMbFZ3BsaF6BCBX","176Zur846iWv9kE3_xWneStjm7gQHXrul","1ppeoNoZDvHANdAyOo4QkKbgxqji7uWKF","10zYPT4_QBr-C6PV1vKVgi293XRMzH6SX","1qa9Ts70ct6XFjcEZsZIm21342j_tQg-L","1HD-695XR6VyWfuT4P5aEWMIH_7trCtD1","13DsGUzeQXDrniI72XZ39Qjt1z_L2hB5c","1t3_NprjxZ1vMVSOaXhSpfqLYeHQpvdSI","1cbk_xSypXWUB5GIbfaV3J08w6VxwTV7-","1CnWjBnVSnFP0_hvhLjHhmDEMgOORyFI7","1625n3k3A8Fd6NKSrzcKurDZaaHdnRcM9","1V7JRTQpmgnoDC8j-WJ74T83FZwAA2StU","1REDXnILsGOzwEnBVKimccUQxzlaVJgJS","1RE78Z2MSMrdOFD7NIxHsPYIKAU5XIk_Q","1DhrNVMKqWHGiE3AQhvtWDp1rc4ZHN3G1"
  )
}

$totalDownloaded = 0
$totalErrors = 0

foreach ($program in $programs.Keys) {
  $ids = $programs[$program]
  $outDir = Join-Path $basePath "$program\slides"

  Write-Host "`n=== $program ($($ids.Count) slides) ===" -ForegroundColor Cyan

  for ($i = 0; $i -lt $ids.Count; $i++) {
    $slideNum = $i + 1
    $outFile = Join-Path $outDir "Slide$slideNum.jpg"

    if (Test-Path $outFile) {
      Write-Host "  Slide$slideNum.jpg - already exists, skipping"
      $totalDownloaded++
      continue
    }

    $url = "$baseUrl$($ids[$i])"
    try {
      Invoke-WebRequest -Uri $url -OutFile $outFile -ErrorAction Stop
      $size = (Get-Item $outFile).Length
      Write-Host "  Slide$slideNum.jpg - $([math]::Round($size/1024))KB" -ForegroundColor Green
      $totalDownloaded++
    } catch {
      Write-Host "  Slide$slideNum.jpg - ERROR: $_" -ForegroundColor Red
      $totalErrors++
    }
  }
}

Write-Host "`n=== DONE ===" -ForegroundColor Yellow
Write-Host "Downloaded: $totalDownloaded | Errors: $totalErrors"
