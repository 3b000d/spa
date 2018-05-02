export default {
  name: 'SignUpComponent',
  data: () => ({
    heading_text: 'أنت على بُعد خطوة واحدة',
    description_text: 'قم بإنشاء حسابك لتبدأ رحلة اكتشاف ميولك ولتنضم إلى مجتمعنا الرائع',
    tos_text: 'بالضغط على إنشاء الحساب، أنت توافق على <a href="/tos">شروط الخدمة</a> الخاصة بالأكاديمية.',
    submit_btn_text: 'إنشاء الحساب',
    alert: {
      success: false,
      error: false,
      message: ''
    },
    valid: 0,
    vs: {
      v1: 0,
      v2: 0,
      v3: 0,
      v4: 0
    },
    fullname: '',
    fullname_label: 'اسمك الكامل',
    fnRules: [
      v => !!v || '',
      v => (v && v.length <= 20) || 'اسم المستخدم لا يجب أن يتجاوز 20 حرفًا'
    ],
    email: '',
    email_label: 'البريد الإلكتروني',
    emRules: [
      v => !!v || '',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'البريد الإلكتروني غير صالح'
    ],
    username: '',
    username_label: 'اسم المستخدم',
    unRules: [
      v => !!v || '',
      v => (v && v.length <= 20) || 'اسم المستخدم لا يجب أن يتجاوز 20 حرفًا'
    ],
    password: '',
    password_label: 'كلمة المرور',
    pw: true,
    pwRules: [
      v => !!v || '',
      v => (v && v.length >= 10) || 'كلمة السر يجب أن تتكون من 10 أحرى على الأقل'
    ]
  }),
  watch: {
    fullname: function(val) {
      if (val[0] !== undefined) {
        document.querySelector('.avatar:nth-child(1)').setAttribute('data-before', val[0])

        // var arabic = /[\u0600-\u06FF]/
        // if (arabic.test(val[0])) {
        //   document.querySelector('.avatar:nth-child(1)').style.lineHeight = '90px'
        // } else {
        //   document.querySelector('.avatar:nth-child(1)').style.lineHeight = '90px'
        // }
      } else { document.querySelector('.avatar:nth-child(1)').setAttribute('data-before', '') }
    }
  },
  updated() {
    this.chackValid()
  },
  methods: {
    chackValid() {
      var root = this

      root.vs.v1 = 1
      root.vs.v2 = 1
      root.vs.v3 = 1
      root.vs.v4 = 1

      root.fnRules.forEach((rule) => {
        if (rule(root.fullname) !== true) {
          root.vs.v1 = 0
        }
      })

      root.emRules.forEach((rule) => {
        if (rule(root.email) !== true) {
          root.vs.v2 = 0
        }
      })

      root.unRules.forEach((rule) => {
        if (rule(root.username) !== true) {
          root.vs.v3 = 0
        }
      })

      root.pwRules.forEach((rule) => {
        if (rule(root.password) !== true) {
          root.vs.v4 = 0
        }
      })

      root.valid = root.vs.v1 + root.vs.v2 + root.vs.v3 + root.vs.v4
    },
    json(success) {
      if (success === true) {
        return JSON.parse('{"success": true, "message": "شكرًا لك على التسجيل"}')
      } else {
        return JSON.parse('{"success": false, "message": "خطأ! يُرجى المحاولة لاحقًا"}')
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        var root = this
        // axios.post('/signup', {username: this.username, email: this.email}).then(
        //     function (response) {
        //         root.alert.message = response.data.message
        //         if (response.data.success == "true") {
        //             root.alert.success = true
        //         } else {
        //             root.alert.error = true
        //         }
        //     }
        // )

        var data = this.json(true)
        root.alert.message = data.message
        if (data.success === true) {
          root.alert.success = true
        } else {
          root.alert.error = true
        }
      }
    }
  }
}
