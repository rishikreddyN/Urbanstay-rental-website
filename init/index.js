const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");

async function  main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
.then(()=>{
    console.log("connected to the data base");
})
.catch((err)=>{
    console.log(err);
})
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
   owner: new mongoose.Types.ObjectId("698cbc732669d1ce6e7476f0"),

  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
