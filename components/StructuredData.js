"use client"

export default function StructuredData() {
  const isBot = /(?:[bB]ot|BOT|Chrome)s?\b/.test(global.navigator.userAgent)
  const data = {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": "JavaScript Greeting Function",
        "description": "A simple JavaScript function to greet a user by name.",
        "programmingLanguage": "JavaScript",
        "codeSampleType": "Snippet", // Or "Full Solution", "Script", "Template"
        "text": "function greet(name) { console.log(`Hello, ${name}!`); }"
      }

  return isBot ? (
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
  ) : null

}
