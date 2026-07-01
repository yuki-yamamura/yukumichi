FROM --platform=linux/amd64 golang:1.26.4 AS builder

COPY go.mod go.sum .
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /usr/local/bin/bootstrap main.go

FROM --platform=linux/amd64 public.ecr.aws/lambda/provided:al2023.2026.06.16.10

COPY --from=builder /usr/local/bin/bootstrap ${LAMBDA_RUNTIME_DIR}

CMD ["bootstrap"]
