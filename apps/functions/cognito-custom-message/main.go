package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

const triggerSourceSignup = "CustomMessage_SignUp"

func handleRequest(ctx context.Context, event events.CognitoEventUserPoolsCustomMessage) (events.CognitoEventUserPoolsCustomMessage, error) {
	if event.TriggerSource != triggerSourceSignup {
		return event, nil
	}

	event.Response.EmailSubject = "[yukumichi] Your verification code"
	event.Response.EmailMessage = "<p>Your verification code is <strong>{####}</strong>.</p>"

	return event, nil
}

func main() {
	lambda.Start(handleRequest)
}
