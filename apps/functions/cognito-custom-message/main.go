package main

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

const triggerSourceSignup = "CustomMessage_SignUp"

var origin string

func handleRequest(ctx context.Context, event events.CognitoEventUserPoolsCustomMessage) (events.CognitoEventUserPoolsCustomMessage, error) {
	if event.TriggerSource != triggerSourceSignup {
		return event, nil
	}

	email := event.Request.UserAttributes["email"].(string)
	escapedEmail := url.QueryEscape(email)
	href := fmt.Sprintf(`%s/sign-up/confirm?email=%s&code={####}`, origin, escapedEmail)

	event.Response.EmailSubject = "[yukumichi] Verify your email"
	event.Response.EmailMessage = fmt.Sprintf(`<a href="%s">Verify %s</a>`, href, email)

	return event, nil
}

func main() {
	o, ok := os.LookupEnv("WEB_ORIGIN")
	if !ok {
		log.Fatal("WEB_ORIGIN environment variable is required")
	}
	origin = o

	lambda.Start(handleRequest)
}
