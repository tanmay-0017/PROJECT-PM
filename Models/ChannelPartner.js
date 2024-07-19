import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  channelPartnerName: String,
  channelPartnerCompanyName: String,
  customerName: String,
  customerMobileLastFour: String,
  projectName:String,
  projectLocation : String,
  partnerId: String,
  attendant: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendant' },
  attendantName: { type: String, required: true },
  timeDuration: {type: String, default: "00 : 00"},
  notes: {type: String},
},
{
  timestamps: true
});

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
