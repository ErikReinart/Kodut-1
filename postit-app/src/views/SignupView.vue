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
           The password is not valid – 
           <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
           </ul>
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
        errors.push("Length must be 8–14 characters");
      if (!/[A-Z]/.test(pw))
        errors.push("Missing an uppercase character");
      if (!/[a-z].*[a-z]/.test(pw))
        errors.push("Needs at least two lowercase characters");
      if (!/[0-9]/.test(pw))
        errors.push("Missing numeric value");
      if (!/^[A-Z]/.test(pw))
        errors.push("Must start with uppercase");
      if (!/_/.test(pw))
        errors.push('Missing "_" character');

      return errors;
    },

    async onSubmit() {
      this.errors = this.validatePassword(this.password);
if (this.errors.length !== 0) return;

  try {
    //SEND credentials to backend
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    //Store JWT returned by backend
    localStorage.setItem("token", data.token);

    //redirect to protected home
    this.$router.push("/");

  } catch (err) {
    alert("Server error");
  }
}
  }
};
</script>
