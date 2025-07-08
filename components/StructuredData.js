export function SoftwareSourceCode({ name, description, text, programmingLanguage = "JavaScript", version }) {

  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "codeSampleType": "Snippet", 
    programmingLanguage,
    name,
    description,
    text,
    version
  }

  return (
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data)
        }}
      />
  )
}
