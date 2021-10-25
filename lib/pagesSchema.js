/**
 * Create a unique index on slug, revision.
 */

db.pages.createIndex({
  slug: 1,
  revision: 1
}, {
  unique: true
})

/**
 * Schema validator
 */
db.runCommand( {
  "collMod": "pages",
  "validator": {
    "$jsonSchema": {
      "bsonType": "object",
      "required": [
        "slug",
        "revision",
        "tests",
        "title"
      ],
      "additionalProperties": false,
      "properties": {
        "_id": {},
        "slug": {
          "bsonType": "string",
          "maxLength": 255,
          "description": "must be a string with length < 255, is required"
        },
        "revision": {
          "bsonType": "int",
          "minimum": 1,
          "description": "must be an int, is required"
        },
        "title": {
          "bsonType": "string",
          "maxLength": 255,
          "description": "must be a string with length < 255, is required"
        },
        "authorName": {
          "bsonType": "string",
          "maxLength": 255,
          "description": "must be a string with length < 255"
        },
        "info": {
          "bsonType": "string",
          "description": "must be a string"
        },
        "initHTML": {
          "bsonType": "string",
          "description": "must be a string"
        },
        "setup": {
          "bsonType": "string",
          "description": "must be a string"
        },
        "teardown": {
          "bsonType": "string",
          "description": "must be a string"
        },
        "visible": {
          "bsonType": "bool",
          "description": "must be a boolean"
        },
        "published": {
          "bsonType": [
            "timestamp",
            "date"
          ],
          "description": "must be a date or timestamp"
        },
        "mirror": {
          "bsonType": "bool",
          "description": "must be a boolean"
        },
        "urlWbm": {
          "bsonType": "string",
          "maxLength": 255,
          "description": "must be a string with length < 255"
        },
        "urljsperf": {
          "bsonType": "string",
          "maxLength": 255,
          "description": "must be a string with length < 255"
        },
        "tests": {
          "bsonType": "array",
          "description": "must be an array with 1 to 50 items, is required",
          "minItems": 2,
          "maxItems": 100,
          "items": {
            "bsonType": "object",
            "required": [
              "title",
              "code",
              "async"
            ],
            "additionalProperties": false,
            "properties": {
              "title": {
                "bsonType": "string",
                "maxLength": 255,
                "description": "must be a string with length < 255, is required"
              },
              "code": {
                "bsonType": "string",
                "description": "must be a string, is required"
                // "maxLength": 65535 // Possibly?
              },
              "async": {
                "bsonType": "bool",
                "description": "must be a boolean, is required"
              }
            }
          }
        }
      }
    }
  }
} )
