<script setup>
import 'animate.css'
import { ref, onMounted } from 'vue'
import { userAccount, userRegisterService } from '@/api/login.js'
import { usePersonStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import loading from '@/components/loadingTwo.vue'
import VScaleScreen from 'v-scale-screen'

const router = useRouter()

const getToken = usePersonStore()

const firstIndex = ref(null)
const nextIndex = ref(null)
const indexs = ref(0)
const buttons = ref(null)
const able = ref(false)
const loginState = ref('login')

// 表单相关逻辑
const form = ref({
  name: '',
  email: '',
  account: '',
  password: '',
  remember: false,
})

const types = ref('contain')

const userLogin = async () => {
  types.value = 'loading'
  const res = await userRegisterService({
    account: form.value.account,
    password: form.value.password,
  })

  if (res.code === 200) {
    // getToken.setProfile(res.data.token)
    localStorage.setItem('authToken', JSON.stringify(res.data.token))
    console.log(getToken.profile)

    router.push('/home')
    ElMessage({
      message: '欢迎使用风影捕手',
      type: 'success',
    })
    types.value = 'contain'
  } else if (res.code === 500) {
    types.value = 'contain'
    ElMessage({
      message: res.msg,
      type: 'warning',
    })
  }
  console.log(res)
}

const userAccounts = async () => {
  const res = await userAccount({
    name: form.value.name,
    account: form.value.account,
    password: form.value.password,
    email: form.value.email,
  })
  if (res.code === 200) {
    form.value = {
      email: '',
      account: '',
      password: '',
      remember: false,
    }
    loginState.value = 'login'
  }
  console.log(res)
}

const rules = ref({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          callback(new Error('邮箱格式不正确，请检查后重新输入'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const formRef = ref(null)

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 表单验证通过，执行登录/注册逻辑
      if (loginState.value === 'register') {
        userAccounts()
      } else if (loginState.value === 'login') {
        userLogin()
      }
      console.log('表单提交:', form.value)
    } else {
      console.log('表单验证失败')
      return false
    }
  })
}

const change = () => {
  if (able.value) {
    firstIndex.value.classList.add('animate__animated', 'animate__fadeOut')
    firstIndex.value.addEventListener('animationend', () => {
      indexs.value = !indexs.value
    })
  } else {
    return
  }
}

const accounts = () => {
  loginState.value = 'register'
  form.value = {
    email: '',
    account: '',
    password: '',
    remember: false,
  }
}

const backButton = () => {
  loginState.value = 'login'
  form.value = {
    email: '',
    account: '',
    password: '',
    remember: false,
  }
}

onMounted(() => {
  buttons.value.classList.add('animate__animated', 'animate__fadeInRight', 'animate__slow')
  buttons.value.addEventListener('animationend', () => {
    able.value = !able.value
  })
})
</script>

<template>
  <v-scale-screen width="1920" height="1080">
    <div class="loginIndex">
      <div class="firstIndex" v-if="!indexs" ref="firstIndex">
        <div class="shadow"></div>
        <div class="circle"></div>
        <div class="title animate__animated animate__fadeInRight animate__slow">Data changes the future</div>
        <div class="bottome animate__animated animate__fadeInRight animate__slow"></div>
        <div class="names animate__animated animate__fadeInRight animate__slow">风影捕手 多模态谣言识别检测系统</div>
        <button class="button" @click="change" ref="buttons">
          <div class="write">立即登录</div>
          <div class="icons">
            <img src="@/assets/login/箭头.png" alt="" class="arrow" />
          </div>
        </button>
      </div>
      <div class="nextIndex" v-else ref="nextIndex">
        <div class="contain" v-if="types === 'contain'">
          <div class="allBg"></div>
          <div class="nextTitle"></div>
          <div class="welcome">欢迎使用风影捕手</div>

          <el-form ref="formRef" :model="form" :rules="rules" class="forms" label-position="top">
            <el-form-item label="邮箱" prop="email" v-if="loginState === 'register'">
              <el-input
                @input="
                  (val) => {
                    console.log('输入值:', val)
                  }
                "
                v-model="form.email"
                class="inputs"
                placeholder="请输入邮箱"
              />
            </el-form-item>

            <el-form-item label="账号" prop="account" style="margin-top: 35px">
              <el-input v-model="form.account" class="inputs" placeholder="请输入账号" type="account" />
            </el-form-item>

            <el-form-item label="密码" prop="password" style="margin-top: 35px">
              <el-input v-model="form.password" class="inputs" placeholder="请输入密码" type="password" show-password />
            </el-form-item>

            <div class="select">
              <el-checkbox v-if="loginState === 'login'" v-model="form.remember" label="记住密码" />
              <div class="rightButton">
                <div class="forget" v-if="loginState === 'login'">忘记密码</div>
                <div class="forget" v-if="loginState === 'register'" @click="backButton">返回登录</div>
                <div class="accounts" v-if="loginState === 'login'" @click="accounts">注册</div>
              </div>
            </div>
          </el-form>

          <div class="loginChecked" @click="submitForm" v-if="loginState === 'login'">确认登录</div>
          <div class="loginChecked" @click="submitForm" v-if="loginState === 'register'">确认注册</div>
        </div>
        <loading v-if="types === 'loading'"></loading>
      </div>
    </div>
  </v-scale-screen>
</template>

<style lang="scss" scoped>
.body {
  resize: none; /* 禁止拖拽调整大小 */
}
.loginIndex {
  width: 1920px;
  height: 1080px;
  background-color: rgba(14, 12, 26, 1);
  overflow: hidden;

  .firstIndex {
    width: 100%;
    height: 100%;
    position: relative;

    .shadow {
      position: absolute;
      left: 0px;
      top: -90px;
      width: 1015px;
      height: 1015px;
      background: rgba(19, 12, 26, 1);
      box-shadow: 0px 50px 50px rgba(38, 255, 251, 0.25);
      border-radius: 50%;
    }

    .circle {
      width: 775px;
      height: 775px;
      background-image: url('@/assets/login/01.png.png');
      background-repeat: no-repeat;
      background-size: contain;
      position: absolute;
      left: 574px;
      top: -90px;
    }

    .title {
      position: absolute;
      left: 1142px;
      top: 417px;
      width: 621px;
      height: 233px;
      font-size: 66px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 77.35px;
      color: rgba(255, 255, 255, 1);
    }

    .bottome {
      width: 150px;
      height: 2px;
      background: rgba(204, 204, 204, 1);
      position: absolute;
      left: 1142px;
      top: 595px;
    }

    .names {
      min-width: 549px;
      height: 48px;
      position: absolute;
      left: 1141.95px;
      top: 614px;
      font-size: 36px;
      font-weight: 500;
      letter-spacing: 0px;
      line-height: 47.74px;
      color: rgba(255, 255, 255, 1);
    }

    .button {
      position: absolute;
      left: 1142px;
      top: 744px;
      width: 247px;
      height: 60px;
      border-radius: 20px;
      background: rgba(23, 160, 179, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .write {
        min-width: 96px;
        height: 60px;
        margin-left: 28px;
        font-size: 24px;
        display: flex;
        align-items: center;
        color: rgba(255, 255, 255, 1);
      }

      .icons {
        width: auto;
        height: 60px;
        display: flex;
        align-items: center;

        .arrow {
          width: 30px;
          height: 20px;
          margin-right: 26px;
        }
      }
    }

    .button:hover {
      box-shadow: 0px 0px 40px rgba(23, 160, 179, 1);
    }
  }

  .nextIndex {
    width: 100%;
    height: 100%;
    position: relative;

    .allBg {
      width: 1080px;
      height: 1080px;
      position: absolute;
      left: 901px;
      bottom: 230px;
      background-image: url('@/assets/login/01.png (2).png');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .nextTitle {
      margin-left: 228px;
      margin-top: 256px;
      width: 454.53px;
      height: 46.91px;
      background-image: url('@/assets/login/word.png');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .welcome {
      margin-left: 228px;
      margin-top: 14px;
      width: 251.35px;
      height: 39.09px;
      font-size: 30px;
      font-weight: 300;
      letter-spacing: 0px;
      color: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
    }

    .forms {
      width: 470px;
      margin-left: 228px;
      margin-top: 59px;

      :deep(.el-form-item) {
        margin-bottom: 35px;

        .el-form-item__label {
          color: rgba(255, 255, 255, 1);
          font-size: 20px;
          font-weight: 300;
          padding-bottom: 7px;
          line-height: 1;
        }

        .el-input {
          .el-input__wrapper {
            width: 465px;
            height: 51px;
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            background-color: rgba(14, 12, 26, 1);
            box-shadow: none;

            .el-input__inner {
              color: rgba(255, 255, 255, 0.8);
              font-size: 18px;
              font-weight: 300;
              padding-left: 15px;
              &::placeholder {
                color: rgba(255, 255, 255, 0.3);
              }
            }
          }
        }
      }

      .select {
        width: 100%;
        height: 22px;
        margin-top: 12px;
        display: flex;
        justify-content: space-between;

        :deep(.el-checkbox) {
          width: 90px;
          height: 22px;
          display: flex;
          justify-content: space-between;

          .el-checkbox__input {
            width: 15px;
            height: 15px;
            margin-top: 1px;
            background-color: rgba(14, 12, 26, 1) !important;

            .el-checkbox__original {
              width: 15px;
              height: 15px;
              padding-top: 4px;
              background-color: rgba(14, 12, 26, 1) !important;
              border: 1px solid rgba(255, 255, 255, 0.4);
            }
          }

          .el-checkbox__label {
            width: 67.03px;
            height: 21.5px;
            font-size: 16px;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.6);
            display: flex;
            align-items: center;
          }
        }

        .rightButton {
          display: flex;
          gap: 12px;

          .forget {
            width: 67px;
            height: 22px;
            font-size: 16px;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.6);
            display: flex;
            align-items: center;
            cursor: pointer;
          }

          .accounts {
            min-width: 30px;
            height: 22px;
            font-size: 16px;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.6);
            display: flex;
            align-items: center;
            cursor: pointer;
          }
        }
      }
    }

    .loginChecked {
      margin-left: 228px;
      margin-top: 30px;
      width: 465px;
      height: 50.82px;
      border-radius: 5px;
      background: rgba(23, 160, 179, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 0px;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }

    .loginChecked:hover {
      box-shadow: 0px 0px 40px rgba(23, 160, 179, 1);
    }
  }
}
</style>
