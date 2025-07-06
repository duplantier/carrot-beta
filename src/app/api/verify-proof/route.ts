import {
  ISuccessResult,
  IVerifyResponse,
  verifyCloudProof,
} from '@worldcoin/minikit-js';
import { NextRequest, NextResponse } from 'next/server';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

/**
 * This route is used to verify the proof of the user
 * It is critical proofs are verified from the server side
 * Read More: https://docs.world.org/mini-apps/commands/verify#verifying-the-proof
 */
export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;

    // Check if app_id is configured
    if (!app_id) {
      console.error("NEXT_PUBLIC_APP_ID environment variable is not set");
      return NextResponse.json({ 
        error: "App ID not configured", 
        status: 500 
      });
    }

    console.log("Verifying proof with:", { action, signal, app_id });

    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action,
      signal,
    )) as IVerifyResponse;

    console.log("Verification result:", verifyRes);

    if (verifyRes.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      console.error("Verification failed:", verifyRes);
      return NextResponse.json({ 
        verifyRes, 
        status: 400,
        error: "Verification failed"
      });
    }
  } catch (error) {
    console.error("Error in verify-proof route:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      status: 500 
    });
  }
}
