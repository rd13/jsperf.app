db.runCommand( {
  "collMod": "test_collection",
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
          "maxLength": 255
        },
        "revision": {
          "bsonType": "int",
          "minimum": 1
        },
        "title": {
          "bsonType": "string",
          "maxLength": 255
        },
        "authorName": {
          "bsonType": "string",
          "maxLength": 255
        },
        "info": {
          "bsonType": "string"
        },
        "initHTML": {
          "bsonType": "string"
        },
        "setup": {
          "bsonType": "string"
        },
        "teardown": {
          "bsonType": "string"
        },
        "visible": {
          "bsonType": "bool"
        },
        "published": {
          "bsonType": [
            "timestamp",
            "date"
          ]
        },
        "jsperfCom": {
          "bsonType": "bool"
        },
        "urlWbm": {
          "bsonType": "string",
          "maxLength": 255
        },
        "urljsperf": {
          "bsonType": "string",
          "maxLength": 255
        },
        "tests": {
          "bsonType": "array",
          "minItems": 1,
          "maxItems": 50,
          "items": {
            "bsonType": "object",
            "required": [
              "title",
              "code",
              "defer"
            ],
            "additionalProperties": false,
            "properties": {
              "title": {
                "bsonType": "string",
                "maxLength": 255
              },
              "code": {
                "bsonType": "string",
                // "maxLength": 65535 // Possibly?
              },
              "defer": {
                "bsonType": "bool"
              }
            }
          }
        }
      }
    }
  }
} )
