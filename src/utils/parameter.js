export const no_special = "^[^_!#$%&'*+/=?`{|}~^.-]+$";

export const constraint = {
  FORM_DATA_DESCRIPTION: () => {
    return " This API has to be sent in form-data.\n \
        The image file can be send by (file) KEY: 'image' and VALUE: image file \n\
        The example body below has to be sent in separate KEY-VALUE \n \
        ex. (text) KEY: 'HID VALUE: 1 \n \
        ps. If want to send null, just don't send that KEY-VALUE pair";
  },

  HID: () => {
    return {
      type: "integer",
      minimum: 1,
      maximum: 9223372036854775807,
    };
  },

  PID: () => {
    return {
      type: "string",
      pattern: "^(C|A|L|P|S)[0-9]+$",
      example: "C200",
    };
  },

  EMAIL: () => {
    return {
      type: "string",
      pattern:
        "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
      //format: 'email',
      maxLength: 254,
      example: "khunlook@gmail.com",
    };
  },

  PASSWORD: () => {
    return {
      type: "string",
      minLength: 6,
    };
  },

  HOSPCODE: () => {
    return {
      type: "string",
      enum: ["APDEK"],
    };
  },

  DATE: () => {
    return {
      type: "string",
      pattern:
        "^(((19|20)([2468][048]|[13579][26]|0[48])|2000)-02-29|((19|20)[0-9]{2}-(0[469]|11)-(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}-02-(0[1-9]|1[0-9]|2[0-8])))$",
      example: "2021-12-31",
    };
  },

  DATE_NULLABLE: () => {
    return {
      type: "string",
      pattern:
        "^(((19|20)([2468][048]|[13579][26]|0[48])|2000)-02-29|((19|20)[0-9]{2}-(0[469]|11)-(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}-02-(0[1-9]|1[0-9]|2[0-8])))$",
      nullable: true,
      example: "2021-12-31",
    };
  },

  TIME: () => {
    return {
      type: "string",
      pattern:
        "^(?<hour>2[0-3]|[01][0-9]):?(?<minute>[0-5][0-9]):?(?<second>[0-5][0-9])$",
      example: "20:20:20",
    };
  },

  DATETIME: () => {
    return {
      type: "string",
      pattern:
        "^(((19|20)([2468][048]|[13579][26]|0[48])|2000)-02-29|((19|20)[0-9]{2}-(0[469]|11)-(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}-02-(0[1-9]|1[0-9]|2[0-8])))[ ](?<hour>2[0-3]|[01][0-9]):?(?<minute>[0-5][0-9]):?(?<second>[0-5][0-9])$",
      example: "2021-01-01 20:20:20",
    };
  },

  AGE: () => {
    return {
      type: "integer",
      minimum: 0,
      example: "12",
    };
  },

  WEIGHT_NULLABLE: () => {
    return {
      type: ["number", "null"],
      minimum: 0,
      maximum: 150,
      allowEmptyValue: true, //for swagger, to send null params
      example: 49.0,
    };
  },

  WEIGHT: () => {
    return {
      type: "number",
      minimum: 0,
      maximum: 150,
      example: 49.0,
    };
  },

  HEIGHT_NULLABLE: () => {
    return {
      type: ["number", "null"],
      minimum: 0,
      maximum: 200,
      allowEmptyValue: true, //for swagger, to send null params
      example: 165.8,
    };
  },

  HEIGHT: () => {
    return {
      type: "number",
      minimum: 0,
      maximum: 200,
      example: 165.8,
    };
  },

  HEADCIRCUM_NULLABLE: () => {
    return {
      type: ["number", "null"],
      minimum: 0,
      maximum: 70,
      allowEmptyValue: true, //for swagger, to send null params
      example: 40.2,
    };
  },

  HEADCIRCUM: () => {
    return {
      type: "number",
      minimum: 0,
      maximum: 70,
      example: 40.2,
    };
  },

  DETAILS: () => {
    return {
      type: "string",
      minLength: 1, // Don't allow empty string ''
      //pattern: no_special,
      nullable: true,
    };
  },

  AGE_MONTH_DESCRIPTION: () => {
    return {
      type: "string",
      example: "37 - 41 เดือน",
    };
  },

  /* APPOINTMENT */
  ALERT: () => {
    return {
      type: "integer",
      minimum: 0,
      maximum: 10,
    };
  },

  LOCATION: () => {
    return {
      type: "string",
      minLength: 1,
      maxLength: 255,
      nullable: true,
    };
  },

  NAME_APPOINTMENT: () => {
    return {
      type: "string",
      //pattern: no_special,
      minLength: 1,
      maxLength: 50,
    };
  },

  EVENT_ID: () => {
    return {
      type: "string",
      //pattern: no_special,
      minLength: 1,
      maxLength: 200,
      nullable: true,
    };
  },

  /* CONSENT */
  CODE_CONSENT: () => {
    return {
      type: "integer",
      minimum: 1,
      maximum: 3,
    };
  },

  ALLOW_CONSENT: () => {
    return {
      type: "integer",
      minimum: 0,
      maximum: 1,
    };
  },

  CATEGORY_CONSENT: () => {
    return {
      type: "string",
      example: "การสำรองข้อมูล",
    };
  },

  INFORMATION_CONSENT: () => {
    return {
      type: "string",
      example: "ให้สำรองข้อมูลในระบบคลาวด์ KhunLook เพื่อป้องกันการสูญหาย",
    };
  },

  /* DENTAL */
  TOOTH: () => {
    return {
      type: "string",
      pattern: "^((?:[1-9])?|(?:[1][0-6])?)(L|R)$",
      example: "7R",
    };
  },

  DETAILS_DENTAL: () => {
    return {
      type: "string",
      enum: ["ฟันขึ้น", "ฟันหลุด", "ฟันผุ", "อุดฟัน", "ครอบ/ถอน/รักษาราก"],
    };
  },

  /* DEVELOPMENT */
  DEVELOPMENT: () => {
    return {
      type: "string",
      pattern:
        "^DSPM([1-9]|[1-9][0-9]|[1][0-3][0-9])$|^DAIM([1-9]|[1-6][0-9]|[7][0])$|^(?<ANAMAI55>[1-9]|[1-6][0-9]|[7][0-5])$|^TEDA([1-9]|[1-9][0-9]|[1][0-4][0-9])$",
      example: "DSPM14",
    };
  },

  RESULT_DEVELOPMENT: () => {
    return {
      type: "string",
      enum: ["0", "1", "2"],
    };
  },

  SCREENING: () => {
    return {
      type: "string",
      enum: ["0", "1"],
    };
  },

  TYPE_CODE_DEVELOPMENT: () => {
    return {
      type: "string",
      pattern: "^[1-6]$",
    };
  },

  DESCRIPTION_DEVELOPMENT: () => {
    return {
      type: "string",
      example: "ทำตามกฎในการเล่นเป็นกลุ่มได้โดยมีผู้ใหญ่แนะนำ (PS)",
    };
  },

  INFORMATION_DEVELOPMENT: () => {
    return {
      type: "string",
      example:
        "ชวนให้เด็กทำงานบ้านด้วยกัน เช่น เก็บของเล่น ล้างจาน กวาดบ้าน ช่วยเก็บเสื้อผ้า หยิบของ ถ้าเด็กทำไม่ได้ ฝึกทุกครั้งที่มีโอกาส เพื่อให้เด็กทำงานบ้านง่ายๆ ได้\\n\\nถ้าเด็กยังทำไม่ได้ ลองฝึกบ่อยๆ ทุกวัน หากผ่านช่วงอายุที่น่าจะทำได้มา 1 เดือน แล้วยังทำไม่ได้ ควรพาไปพบแพทย์หรือบุคลากรสาธารณสุข",
    };
  },

  TYPE_DESCRIPTION_DEVELOPMENT: () => {
    return {
      type: "string",
      example: "การเคลื่อนไหว",
    };
  },

  TBName_DEVELOPMENT: () => {
    return {
      type: "string",
      enum: ["GL_DEVELOPMENT_DSPM", "GL_DEVELOPMENT_DAIM", "GL_DEVELOPMENT"],
    };
  },

  TBName_TYPE_DEVELOPMENT: () => {
    return {
      type: "string",
      enum: ["GL_DEVELOPMENT_TYPE_DSPM_DAIM", "GL_DEVELOPMENT_TYPE"],
    };
  },

  SECOND: () => {
    return {
      type: "integer",
    };
  },

  VIDEOID: () => {
    return {
      type: "string",
      example: "zQoxjVrpbk0",
    };
  },

  PARAMETER_NAME: () => {
    return {
      type: "string",
      enum: ["MAX_ANAMAI55_DEVELOPMENT", "MIN_ANAMAI55_DEVELOPMENT"],
    };
  },

  PARAMETER_VALUE: () => {
    return {
      type: "string",
      pattern: "^[0-9]+$",
      example: "2",
    };
  },

  TYPE_TEDA_LOG: () => {
    return {
      type: "string",
      enum: ["โรงพยาบาล", "แพทย์"],
    };
  },

  PROVINCE: () => {
    return {
      type: "string",
      example: "ลพบุรี",
    };
  },

  /* FETAL MOVEMENT */
  TYPE_CODE_FETAL_MOVEMENT: () => {
    return {
      type: "integer",
      minimum: 0,
      maximum: 1,
    };
  },

  MOVEMENT_MEANING: () => {
    return {
      type: "string",
      example: "มากกว่า 10 ครั้ง",
    };
  },

  MOVEMENT_SUMMARY_MEANING: () => {
    return {
      type: "string",
      example: "ลูกดิ้นปกติ พรุ่งนี้มานับกันอีกนะครับ",
    };
  },

  INFORMATION_FETAL_MOVEMEMT: () => {
    return {
      type: "string",
      example:
        "การนับลูกดิ้นเป็นการบ่งบอกถึงสุขภาพลูกในครรภ์ด้วยครับ คุณแม่ควรนับจำนวนครั้งที่ลูกดิ้นทุกวัน โดยดูว่าตั้งแต่คุณแม่ตื่นนอนจนถึงเที่ยงลูกดิ้นกี่ครั้ง",
    };
  },

  DESCRIPTION_FETAL_MOVEMEMT: () => {
    return {
      type: "string",
      example:
        "ลูกควรดิ้นมากกว่า 10 ครั้งครับ  ถือว่าปกติ พรุ่งนี้มานับกันอีกนะครับ",
    };
  },

  /* HOME */
  NAME_HOME: () => {
    return {
      type: "string",
      minLength: 1,
      maxLength: 50,
      //pattern: no_special
    };
  },

  ABOGROUP: () => {
    return {
      type: "string",
      pattern: "^[1-4]{1}$",
      nullable: true,
      example: "2",
    };
  },

  RHGROUP: () => {
    return {
      type: "string",
      pattern: "^[1-3]{1}$",
      nullable: true,
      example: "1",
    };
  },

  BTIME: () => {
    return {
      type: "string",
      pattern:
        "^(?<hour>2[0-3]|[01][0-9])?(?<minute>[0-5][0-9])?(?<second>[0-5][0-9])$",
      nullable: true,
      example: "235959",
    };
  },

  IMAGE: () => {
    return {
      type: "string",
      pattern: "^[A-Za-z0-9._]+$",
      minLength: 1,
      maxLength: 2083,
      example: "0_C13.png",
    };
  },

  IMAGE_NULLABLE: () => {
    return {
      type: "string",
      pattern: "^[A-Za-z0-9._]+$",
      minLength: 1,
      maxLength: 2083,
      example: "0_C13.png",
      nullable: true,
    };
  },

  MEMO: () => {
    return {
      type: "string",
      minLength: 1,
      maxLength: 2083,
      nullable: true,
    };
  },

  SEX: () => {
    return {
      type: "string",
      enum: ["1", "2", "3"],
    };
  },

  BWEIGHT: () => {
    return {
      type: "integer",
      minimum: 0,
      maximum: 9999,
      nullable: true,
    };
  },

  GA: () => {
    return {
      type: "integer",
      minimum: 20,
      maximum: 43,
      nullable: true,
    };
  },

  ASPHYXIA: () => {
    return {
      type: "string",
      enum: ["1", "2", "9"],
    };
  },

  DESCRIPTION_ASPHYXIA: () => {
    return {
      type: "string",
    };
  },

  GRAVIDA: () => {
    return {
      type: "string",
      pattern: "^[0-9]{1,2}$",
      example: "2",
    };
  },

  /* GROWTH */
  TBName_WH: () => {
    return {
      type: "string",
      enum: [
        "GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO",
        "GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO",
      ],
      example: "GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO",
    };
  },

  PERCENTILE: () => {
    return {
      type: "number",
    };
  },

  BORDER: () => {
    return {
      type: "number",
      nullable: true,
    };
  },

  RESULT_GROWTH: () => {
    return {
      type: "string",
      example: "ไม่ทราบส่วนสูงล่าสุด ไม่สามารถคำนวณดัชนีมวลกายได้",
    };
  },

  /* MEMORY */
  ALBUMID: () => {
    return {
      type: "integer",
    };
  },

  TITLE: () => {
    return {
      type: "string",
      //pattern: no_special,
      minLength: 1,
      maxLength: 50,
    };
  },

  /* VACCINE */
  VACCINETYPE: () => {
    return {
      type: "string",
      pattern: "^[A-Z0-9]{3}$",
      example: "H12",
    };
  },

  IN_PLAN: () => {
    return {
      type: "string",
      enum: ["0", "1", "2"],
    };
  },

  HOSPITALCODE: () => {
    return {
      type: "string",
      pattern: "^[A-Z0-9]{5}$",
      example: "AP752",
    };
  },

  HOSPITALCODE_NULLABLE: () => {
    return {
      type: "string",
      pattern: "^[A-Z0-9]{5}$",
      example: "AP752",
      nullable: true,
    };
  },

  HOSPITAL: () => {
    return {
      type: "string",
      //pattern: no_special,
      minLength: 1,
      maxLength: 255,
      example: "โรงพยาบาลวชิระภูเก็ต สาขา หยี่เต้ง VACHIRA EXPRESS",
    };
  },

  DESCRIPTION: () => {
    return {
      type: "string",
      maxLength: 150,
      example: "JE2: Lived attenuated",
    };
  },

  DISEASE: () => {
    return {
      type: "string",
      maxLength: 125,
      example: "คอตีบ,ไอกรน,บาดทะยัก",
    };
  },

  INFORMATION: () => {
    return {
      type: "string",
    };
  },
  GRP_NAME: () => {
    return {
      type: "string",
      example: "Hib",
    };
  },

  SEX_VACCINE: () => {
    return {
      type: "integer",
      enum: [1, 2, 0],
    };
  },

  /* PRENATAL - WEIGHT */
  MOTHERWEIGHT: () => {
    return {
      type: "number",
      minimum: 0,
      maximum: 999,
      example: 59.0,
    };
  },

  BMI: () => {
    return {
      type: "integer",
      example: 18.5,
    };
  },

  RESULT_ANC: () => {
    return {
      type: "string",
      example: "น้ำหนักปกติ",
    };
  },

  GA: () => {
    return {
      type: "integer",
      minimum: 4,
      maximum: 41,
    };
  },

  INFORMATION_GA: () => {
    return {
      type: "string",
      example: "ตอนนี้ลูกมีขนาดประมาณเมล็ดอัลมอนด์ค่ะ",
    };
  },

  ORDER_GA: () => {
    return {
      type: "integer",
      minimum: 1,
    };
  },

  DESCRIPTION_GA: () => {
    return {
      type: "string",
      example: "หญิงตั้งครรภ์ควรตรวจคัดกรองมะเร็งปากมดลูกหรือไม่?",
    };
  },

  ROUTE: () => {
    return {
      type: "string",
      example: "WEIGHT",
    };
  },

  BUTTON: () => {
    return {
      type: "string",
      example: "บันทึกผล",
    };
  },

  BOOLEAN: () => {
    return {
      type: "integer",
      minimum: 0,
      maximum: 1,
    };
  },

  CATEGORY: () => {
    return {
      type: "string",
      example: "FOOD_FOR_MOM",
    };
  },

  CATEGORY_TH: () => {
    return {
      type: "string",
      example: "อาหารสำหรับคุณแม่",
    };
  },

  QUESTION: () => {
    return {
      type: "string",
      example: "41",
    };
  },

  RESULT_GA: () => {
    return {
      type: "string",
      example: "ถูกต้องแล้วครับ การดื่มน้ำมากขึ้น ช่วยได้ครับ",
    };
  },

  CHOICE: () => {
    return {
      type: "string",
      pattern: "^[a-z]{1}$",
    };
  },

  DETAILS_CHOICE: () => {
    return {
      type: "string",
      minLength: 1, // Don't allow empty string ''
    };
  },

  VACCINETYPE_GA: () => {
    return {
      type: "string",
      pattern: "^[A-Z0-9]{2,3}$",
      example: "H12",
    };
  },

  MONTH_GA: () => {
    return {
      type: "integer",
      minimum: 0,
      maximum: 40,
    };
  },

  CODE_ANC: () => {
    return {
      type: "integer",
    };
  },
};
