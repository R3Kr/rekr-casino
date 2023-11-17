import next from "next";
import React from "react";
const asd = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 3000); // 3000 milliseconds = 3 seconds
  });
export default async function Pprtest() {
  const aprrovedTime = await fetch(
    "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.158/lat/58.5812/data.json",
    { cache: "no-store" }
  )
    .then((r) => r.json())
    .then((r) => r.approvedTime)
    .then(async (r) => {
      await asd()
      return r;
    });

  return <div>{aprrovedTime}</div>;
}
