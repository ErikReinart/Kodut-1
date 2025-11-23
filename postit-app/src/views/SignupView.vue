<template>
  <main class="center-box">
    <div class="signup-box">
      <form class="signup-form" @submit.prevent="onSubmit">

         <div class="form-row">
            <label>Email</label>
            <input type="email" v-model="email" required />
         </div>

         <div class="form-row">
            <label>Password</label>
            <input type="password" v-model="password" required />
         </div>

         <p v-if="errors.length" style="color:red;">
           The password is not valid – {{errors[0] }}
         </p>

         <button type="submit" class="signup-button">Signup</button>

       </form>
      </div>
     </main>
   </template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },

  methods: {
    validatePassword(pw) {
      const errors = [];

      if (pw.length < 8 || pw.length >= 15)
        return ["Length must be 8–14 characters"];
      if (!/[A-Z]/.test(pw))
        return ["Missing an uppercase character"];
      if (!/[a-z].*[a-z]/.test(pw))
        return ["Needs at least two lowercase characters"];
      if (!/[0-9]/.test(pw))
        return ["Missing numeric value"];
      if (!/^[A-Z]/.test(pw))
        return ["Must start with uppercase"];
      if (!/_/.test(pw))
        return ['Missing "_" character'];

      return errors;
    },

    onSubmit() {
      this.errors = this.validatePassword(this.password);

      if (this.errors.length == 0) {
        alert("Signup successful!");
        this.$router.push("/");
      }
    }
  }
};
</script>
