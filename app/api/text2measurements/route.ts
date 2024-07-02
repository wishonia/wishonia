import { NextRequest, NextResponse } from 'next/server';
import { text2measurements } from "@/lib/text2measurements";
import {handleError} from "@/lib/errorHandler";

export async function POST(request: NextRequest) {
  let { statement, utcDateTime, timeZoneOffset, text } = await request.json();
  if(!statement){statement = text;}

try {
  const measurements = await text2measurements(statement, utcDateTime, timeZoneOffset);
    return NextResponse.json({ success: true, measurements: measurements });
  } catch (error) {
    return handleError(error, "text2measurements")
  }
}

export async function GET(req: NextRequest) {
  const urlParams = Object.fromEntries(new URL(req.url).searchParams);
  const statement = urlParams.statement as string;
  const utcDateTime = urlParams.utcDateTime as string;
  let timeZoneOffset = 0;
  if(urlParams.timeZoneOffset){
    timeZoneOffset = parseInt(urlParams.timeZoneOffset);
  } else {
    console.error("timeZoneOffset is not provided");
  }

  try {
    const measurements = await text2measurements(statement, utcDateTime, timeZoneOffset);
    return NextResponse.json({ success: true, measurements: measurements });
  } catch (error) {
    return handleError(error, "text2measurements");
  }
}
