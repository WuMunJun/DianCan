const validator = {
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ]
  },
  "fenlei_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ]
  },
  "price": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "number"
      }
    ]
  },
  "original_price": {
    "rules": [
      {
        "format": "number"
      }
    ]
  },
  "image": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "description": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "unit": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "stock": {
    "rules": [
      {
        "format": "number"
      }
    ]
  },
  "status": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "sale_time_start": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "sale_time_end": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "sort": {
    "rules": [
      {
        "format": "number"
      }
    ]
  }
}

const enumConverter = {
  "status": {
    "上架": "上架",
    "下架": "下架"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
