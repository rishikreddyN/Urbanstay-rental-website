const Listing = require("../models/listings.js");

// INDEX
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

// NEW FORM
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

// EDIT FORM
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

// SHOW
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      });;
    res.render("listings/show.ejs",{listing});
};

// CREATE
module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    newListing.image = {
        url: url,
        filename: filename
    };

    newListing.owner = req.user._id;

    await newListing.save();   

    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

// UPDATE
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        {...req.body.listing},
        {new:true}
    );
    // if new image uploaded
    if(req.file){
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};


// DELETE
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
