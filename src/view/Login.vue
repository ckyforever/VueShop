<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <el-form
        ref="loginForm"
        class="login_form"
        :model="loginForm"
        :rules="loginRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-gerenzhongxin"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetForm('loginForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '用户密码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    login () {
      this.$refs.loginForm.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post(
          'api/private/v1/login',
          this.loginForm
        )
        if (res.meta.status !== 200) {
          this.$alert(res.meta.msg, '失败', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.$message({
                type: 'error',
                message: '登入失败'
              })
            }
          })
        }
        this.$alert(res.meta.msg, '成功', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'success',
              message: '登入成功'
            })
          }
        })
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
