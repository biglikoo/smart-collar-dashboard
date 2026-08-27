import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DIAGNOSTIC_STATE, type DiagnosticFlag } from '@/types/smartcollar';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Parse incoming payload based on requested schema format:
    // Timestamp, Collar_ID, Predicted_State, Feature_Time_ms, Inference_Time_ms, Total_Edge_ms, Core_Temp_C
    const {
      Timestamp,
      Collar_ID,
      Predicted_State,
      Feature_Time_ms,
      Inference_Time_ms,
      Total_Edge_ms,
      Core_Temp_C,
      Battery_mV, // Optional additions for UI compatibility
    } = body;

    if (!Collar_ID || Predicted_State === undefined) {
      return NextResponse.json({ error: 'Missing required fields: Collar_ID, Predicted_State' }, { status: 400 });
    }

    // Default Battery_mV for testing if not provided by device payload
    const mockBatteryMv = Battery_mV ?? Math.floor(Math.random() * (4200 - 3500 + 1)) + 3500;

    // Upsert the Collar to ensure it exists in the registry
    await prisma.collar.upsert({
      where: { id: String(Collar_ID) },
      update: { last_seen: new Date() },
      create: { 
        id: String(Collar_ID), 
        breed: 'Yankasa', // Defaulting to Yankasa if unknown
        status: 'ONLINE' 
      },
    });

    // Extract state label from our shared types
    const stateInfo = DIAGNOSTIC_STATE[Predicted_State as DiagnosticFlag];
    const stateLabel = stateInfo ? stateInfo.label : "Unknown";

    // Insert the Telemetry record
    const telemetry = await prisma.telemetry.create({
      data: {
        device_id: String(Collar_ID),
        diagnostic_flag: Number(Predicted_State),
        state_label: stateLabel,
        core_temp_c: Core_Temp_C ? Number(Core_Temp_C) : undefined,
        feature_time_ms: Feature_Time_ms ? Number(Feature_Time_ms) : undefined,
        inference_time_ms: Inference_Time_ms ? Number(Inference_Time_ms) : undefined,
        total_edge_ms: Total_Edge_ms ? Number(Total_Edge_ms) : undefined,
        battery_mv: mockBatteryMv, // Keeping UI compatible
        timestamp: Timestamp ? new Date(Timestamp) : new Date(),
      },
    });

    return NextResponse.json({ success: true, telemetry }, { status: 201 });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
