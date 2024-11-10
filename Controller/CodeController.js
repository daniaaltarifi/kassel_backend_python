const db=require('../config')
const addCode=async(req,res)=>{
    const {code,exp_date}=req.body;
    if(!code ||!exp_date){
        return res.status(400).json({error:'Missing value'})
    }
    const query="INSERT INTO codes (code,exp_date) VALUES (?,?)";
    db.query(query,[code,exp_date],(error,results)=>{
        if(error){
            console.error("Error inserting data:",error);
            return res.status(500).json({error:"Database error"})
        }
        res.json({message:'Code added successfully'})
    })
}
const getCodes=async(req,res)=>{
    const query="SELECT * FROM codes";
    db.query(query,(error,results)=>{
        if(error){
            console.error("Error retrieving data:",error);
            return res.status(500).json({error:"Database error"})
        }
        res.json(results)
    })
}
const getCodeById=async(req,res)=>{
    const {id}=req.params;
    if(!id){
        return res.status(400).json({error:'Missing value'})
    }
    const query="SELECT * FROM codes WHERE id=?";
    db.query(query,[id],(error,results)=>{
        if(error){
            console.error("Error retrieving data:",error);
            return res.status(500).json({error:"Database error"})
        }
        if(results.length===0){
            return res.status(404).json({message:'Code not found'})
        }
        res.json(results[0])
    })
 
}
const updateCodes=async(req,res)=>{
    const {id}=req.params;
    const {code,exp_date}=req.body;
    if(!id ||!code ||!exp_date){
        return res.status(400).json({error:'Missing value'})
    }
    const query="UPDATE codes SET code=?, exp_date=? WHERE id=?";
    db.query(query,[code,exp_date,id],(error,results)=>{
        if(error){
            console.error("Error updating data:",error);
            return res.status(500).json({error:"Database error"})
        }
        if(results.affectedRows===0){
            return res.status(404).json({message:'Code not found'})
        }
        res.json({message:'Code updated successfully'})
    })
}
const deleteCodes=async(req,res)=>{
    const {id}=req.params;
    if(!id){
        return res.status(400).json({error:'Missing value'})
    }
    const query="DELETE FROM codes WHERE id=?";
    db.query(query,[id],(error,results)=>{
        if(error){
            console.error("Error deleting data:",error);
            return res.status(500).json({error:"Database error"})
        }
        if(results.affectedRows===0){
            return res.status(404).json({message:'Code not found'})
        }
        res.json({message:'Code deleted successfully'})
    })

}
const verifyCodes = async (req, res) => {
    const { user_id, code } = req.body;

    try {
        const query = 'SELECT exp_date, id FROM codes WHERE code = ?';
        const [results] = await db.promise().query(query, [code]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Code not found' });
        }

        const expDate = new Date(results[0].exp_date);
        const currentDate = new Date();

        // Check if the code is expired
        if (expDate < currentDate) {
            return res.status(200).json({ message: 'Code has expired', valid: false });
        }

        const addUserCodeQuery = 'INSERT INTO users_codes (user_id, code_id) VALUES (?, ?)';
        await db.promise().query(addUserCodeQuery, [user_id, results[0].id]);

        // If the insert is successful, respond accordingly
        return res.status(200).json({ message: 'Verification successful', valid: true });

    } catch (error) {
        console.error("Error querying database:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getusersCodes = async (req, res) => {
    const { user_id } = req.params; // Get user_id from request parameters
    try {
        const query = `
            SELECT uc.user_id, uc.code_id, c.exp_date AS exp_date 
            FROM users_codes uc 
            JOIN codes c ON uc.code_id = c.id 
            WHERE uc.user_id = ?
        `;
        const [results] = await db.promise().query(query, [user_id]);
        const validCodes = results.filter(code => {
            const expirationDate = new Date(code.exp_date);
            const now = new Date();
            return expirationDate > now; // Check if expiration is in the future
        });
        res.json({ codes: validCodes });
    } catch (error) {
        console.error("Error querying database:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports={addCode,getCodes,updateCodes,deleteCodes,getCodeById,verifyCodes,getusersCodes}