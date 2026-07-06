import { NextResponse } from "next/server";

type NotifyRequestBody = {
  email?: unknown;
  sourceSection?: unknown;
};

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as NotifyRequestBody;
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const sourceSection =
    typeof body.sourceSection === "string"
      ? body.sourceSection.trim()
      : "app_coming_soon";

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = getBrevoListId();

  if (!apiKey || !listId) {
    return NextResponse.json(
      { message: "The waitlist is not configured yet." },
      { status: 503 }
    );
  }

  const response = await fetch(BREVO_CONTACTS_URL, {
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    method: "POST"
  });

  if (!response.ok) {
    const errorMessage = await getBrevoErrorMessage(response);

    return NextResponse.json(
      {
        message:
          errorMessage ??
          "We could not add you to the waitlist. Please try again."
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    message: "You are on the list. We will let you know when Paritium launches.",
    sourceSection
  });
}

function getBrevoListId() {
  const listId = Number(process.env.BREVO_LIST_ID);

  return Number.isInteger(listId) && listId > 0 ? listId : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getBrevoErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as {
      code?: string;
      message?: string;
    };

    if (payload.code === "duplicate_parameter") {
      return "You are already on the list.";
    }

    return payload.message;
  } catch {
    return null;
  }
}
