const Expense = require("../model/expenseModel");
const Roomm = require('./roomController');
const Room = require("../model/RoomModel")

const addexpense = async (req, res) => {
    try {

        const expense = new Expense({
            title: req.body.title,
            description: req.body.description,
            amount: req.body.amount,
            Roomtitle: req.body.Roomtitle,

        })
        const room = await Room.findOne({
            _id: expense.Roomtitle
        })

        var expense_data = await expense.save();
        var update_respone = await Roomm.Roomtotalexp(expense.Roomtitle, expense.amount)
        res.status(200).send({ success: true, msg: "Expense Added", data: expense_data })
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message })
    }
}

const expenseGet = async (req, res) => {
    try {

        const expense = await Expense.find().sort({ $natural: -1 }).populate("Roomtitle", "title",)


        res.status(201).json({ success: true, msg: "Expense details", data: expense })

    } catch (error) {
        res.status(422).json({ success: false, msg: "error" });
    }

}

const expensedelete = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id",id)
 
        var oldExpense = await Expense.findOne({
            _id: id
        });
//  console.log("old",oldExpense)
        const deletexpense = await Expense.findByIdAndDelete({ _id: id })
        // res.status(201).json({success:true,msg:"Expense deleted"});
        const room = await Room.findById(oldExpense.Roomtitle)
        room.Roomtotalexpense = room.Roomtotalexpense-oldExpense.amount
        var RoomTotalexp= room.Roomtotalexpense
        Room.findByIdAndUpdate({ _id: oldExpense.Roomtitle },
            { Roomtotalexpense: RoomTotalexp }, function (err, data) {
                console.log("room",)
                if (err) {
                    res.status(422).json(error);
                }
                else {
                    res.status(201).json({ success: true, msg: "expense deleted" });
                }
            });
        
        
    } catch (error) {
        res.status(422).json(error);
    }
}

const updatexpense = async (req, res) => {
  
    try {
        const { id } = req.params;
        var oldExpense = await Expense.findOne({
            _id: id
        });
 
    

        const updatedexpense = await Expense.findByIdAndUpdate(id, req.body, {
            new: true
        }).populate("Roomtitle");
        console.log("update", updatedexpense.amount)
        console.log("room1",updatedexpense?.Roomtitle?.title)
        
        var room = await Room.findById({_id:req.body.Roomtitle});
        room.Roomtotalexpense = (room.Roomtotalexpense - oldExpense.amount ) 
        var roomTotalExpese= room.Roomtotalexpense + updatedexpense.amount
       console.log("aman",roomTotalExpese)

        Room.findByIdAndUpdate({ _id: req.body.Roomtitle },
            { Roomtotalexpense: roomTotalExpese }, function (err, data) {
              
                if (err) {
                    res.status(422).json(error);
                }
                else {
                    res.status(201).json({ success: true, msg: "expense updated" });
                }
            });


    } catch (error) {
        res.status(422).json(error);
    }
}


const individualexpense = async (req, res) => {
    const { id } = req.params;
    try {
        
        const expensebyid = await Expense.findById({ _id: id }).populate("Roomtitle", "title")
        console.log(expensebyid)

        res.status(201).json({ success: true, msg: "expense details", data: expensebyid })
    } catch (error) {
        res.status(422).json(error);
    }
}

//user all expense 
const userExpense = async (req, res) => {
    try {
        const indexp = await Expense.find({ users: { $elemMatch: { $eq: req.user._id } } })
        var totalamount = 0;
        for (var exp of indexp) {
            totalamount += exp["amount"]
        }
        res.status(200).json({
            status: "Success",
            exp: indexp,
            total: totalamount
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

module.exports = {
    addexpense, expenseGet, expensedelete, updatexpense, individualexpense, userExpense
}