const express = require('express')
const app = express()
// 認証時に使用するパスワードを安全にハッシュ化するモジュール
// パスワードをデータベースに保存する時、ハッシュ化する必要がある。
// ハッシュとは　
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req,res) => {
   res.json(users)
})

app.post('/users', async (req,res) =>{
   try{
      // Salt作成
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const user = {name: req.body.name, password: hashedPassword }
      users.push(user)
      res.status(201).send()
   } catch{
      res.status(500).send()
   }
})

app.post('/users/login',async (req, res) =>{
   const user = users.find(user => user.name = req.body.name)
   if(user == null){
      return res.status(400).send('Cannot find user')
   }
   try{
      if(await bcrypt.compare(req.body.password, user.password)){
         res.send('Success')
      } else{
         res.send('NOT Allowed')
      }
   }catch{
      res.status(500).send()
   }
})

app.listen(3000)