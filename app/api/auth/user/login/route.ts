import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { connect } from "@/db/db";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqDataBody = await request.json();
    const { username, password } = reqDataBody;
    const findResult = await User.findOne({ username });
    if (!findResult) {
      return NextResponse.json(
        {
          error: "User does not exist",
        },
        { status: 404 }
      );
    } else {
      // checking if password is correct
      const passwordMatch = await bcryptjs.compare(
        password,
        findResult.password
      );
      if (!passwordMatch) {
        return NextResponse.json(
          {
            error: "Password is incorrect",
          },
          {
            status: 401,
          }
        );
      } else {
        // after login we need to send a token to the user which will be saved in the user cookies (not local storage)
        // creating tokendata
        const tokenData = {
          id: findResult._id,
          username: findResult.username,
          email: findResult.email,
        };
        // create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
          expiresIn: "1m",
        });
        // token is created but is not sent to cookies
        const response = NextResponse.json(
          {
            username: findResult.username,
            authToken: token,
            message: "User logged in successfully",
            success: true,
          },
          { status: 200 }
        );
        // nextresponse can access cookies
        response.cookies.set("authToken", token, {
          httpOnly: true,
        });
        return response;
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
