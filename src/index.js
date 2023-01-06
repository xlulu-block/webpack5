import './sass.scss'
import logo from '/public/big.png'
const img=new Image()
img.src=logo
document.getElementById('imgBox').appendChild(img)
class Person{
    name='扎根三'
    age=18
    gender='未知'
    Message(){
        return{
            name:this.name,
            age:this.age,
            gender:this.gender
        }
    }
}
module.exports=Person