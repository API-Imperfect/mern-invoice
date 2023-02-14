import moment from "moment";

function addCurrencyCommas(currency) {
    if (currency) {
        return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export default function ({
                             profile,
                             document,
                             balanceDue,
                             status,
                             totalAmountReceived,
                         }) {
    return `
	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8">
	<style>
	body{
	font-family: Arial, Helvetica, sans-serif;
	max-width: 1200px;
	border: 2px solid #eee;
	box-shadow: 0 0 10px rgba(0,0,0,.15);
	margin: auto;
	padding: 20px;
	border-radius: 10px;
	}
	.container{
	margin: 0 auto;
	padding-top: 10px;
	}
	.heading{
	height: 180px;
	}
	.left{
	float: left;
	}
	.right{
	float: right;
	}
	.divider{
            height: 3px;
            background-color: rgb(17,65,141);
            margin-bottom: 10px;
            margin-top: 10px;
          }
    .column{
    float: left;
    width: 30%;
    padding: 7px;
    }
    .row:after{
    content: "";
    display: table;
    clear: both;
    }
    .two-column{
    float: left;
    width: 50%;
    }
    img{
    width: 150px;
    height: 150px;
    }
    .header{
    font-weight: 100;
    text-transform: uppercase;
    color: #555;
    letter-spacing: 2px;
    font-size: 10px;
    line-height: 5px;
    }
    table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #ddd;
    font-family: Arial, Helvetica, sans-serif;
    }
    th, td {
    text-align: left;
    padding: 16px;
    }
    tr:nth-child(even){
    background-color: #f2f2f2;
    }
    .summary {
    margin: 20px 0 15px 50%;
    }
</style>
</head>
<body>
   <div class="container">
     <section class="heading">
             <div class="left">
               ${
        profile?.avatar
            ? `<img src=${profile?.avatar} alt="profile image"/>`
            : `<h2>___</h2>`
    }
             </div>
             <div class="right">
                 <h2 style="font-size: 38px; font-weight:200; font-family: Arial, Helvetica, sans-serif;">${
        Number(balanceDue) <= 0
            ? "Receipt"
            : document?.documentType
    }</h2>
                 <h6 style="font-size: 18px; font-family: Arial, Helvetica, sans-serif; color:#5a5a5a;">
                   <b> No: ${document?.documentNumber}</b>
               </h6>
             </div>
     </section>
     <hr class="divider">
     <section class="row">
       <div class="column">
         <h3 style="font-size: 14px; text-transform: uppercase;"> <strong>From: </strong></h3>
         <p style="font-size: 12px">${profile?.businessName}</p>
         <p style="font-size: 12px">${profile?.email}</p>
         <p style="font-size: 12px">${profile?.phoneNumber}</p>
         <p style="font-size: 12px">${
        profile?.address ? profile.address : ""
    }</p>
         <p style="font-size: 12px">${profile?.city ? profile.city : ""}</p>
         <p style="font-size: 12px">${
        profile?.country ? profile.country : ""
    }</p>
       </div>
       <div class="column">
         <h3 style="font-size: 14px; text-transform: uppercase;"> <strong>Bill To: </strong></h3>
         <p style="font-size: 12px">${document?.customer?.name}</p>
         <p style="font-size: 12px"> <span class="header">No: </span>${
        document?.customer?.accountNo
    }</p>
         <p style="font-size: 12px"> <span class="header">VAT/TIN No:</span> </>${
        document?.customer?.vatTinNo
    }</p>
         <p style="font-size: 12px">${document?.customer?.email}</p>
         <p style="font-size: 12px">${document?.customer?.phoneNumber}</p>
         <p style="font-size: 12px">${document?.customer?.address}</p>
         <p style="font-size: 12px">${document?.customer?.city}</p>
         <p style="font-size: 12px">${document?.customer?.country}</p>
       </div>
       <div class="column">
         <h3 style="font-size: 14px; text-transform: uppercase;"> <strong>Payment Status: </strong></h3>
         <h4 style="font-size: 12px">${
        totalAmountReceived >= document?.total ? "Paid" : status
    }
     </h4>
     <p class="header">Issued on:</p>
     <p style="font-size: 12px">
       ${moment(document?.createdAt).format("DD-MM-YYYY")}
     </p>
     <p class="header">Due on: </p>
      <p style="font-size: 12px">
       ${moment(document?.dueDate).format("DD-MM-YYYY")}
     </p>
     <p class="header">Total Amount:</p>
     <p>
       <b><span style="font-size: 16px">${document?.currency}</span></b>
       <b><span style="font-size: 16px">${addCurrencyCommas(
        document?.total.toFixed(2)
    )}</span></b>
     </p>
       </div>
     </section>
     <hr class="divider">
     <table>
       <tr style="background-color: black; color:white">
         <th style="font-size: 10px">#</th>
         <th style="font-size: 10px">Product/Service</th>
         <th style="font-size: 10px">Qty</th>
         <th style="font-size: 10px">Unit Price/Rate</th>
         <th style="font-size: 10px">Discount(%)</th>
         <th style="font-size: 10px">Line Total</th>
       </tr>
       ${document?.billingItems?.map(
        (item, index) =>
            `<tr>
         <td style="font-size: 10px">${index + 1}</td>
         <td style="font-size: 10px">${item.itemName}</td>
         <td style="font-size: 10px">${item.quantity}</td>
         <td style="font-size: 10px">${item.unitPrice}</td>
         <td style="font-size: 10px">${item.discount}</td>
         <td style="font-size: 10px">${(
                item?.quantity * item.unitPrice -
                (item.quantity * item.unitPrice * item.discount) / 100
            ).toFixed(2)}</td>
 </tr>`
    )}
    
     </table>
     <section class="summary">
           <table>
             <tr style="background-color: black; color:white">
               <th style="font-size: 12px; text-align:center">Cost Summary</th>
               <th></th>
             </tr>
             <tr>
               <td style="font-size: 10px">Sub Total:</td>
               <td style="text-align: right; font-size: 10px; font-weight: 700">${
        document?.currency
    }
                 ${addCurrencyCommas(document?.subTotal.toFixed(2))}
                 </td>
             </tr>
             <tr>
               <td style="font-size: 10px">VAT/Sales Tax (${
        document?.rates
    }%):</td>
               <td style="text-align: right; font-size: 10px; font-weight: 700">${
        document?.currency
    }
                 ${document?.salesTax.toFixed(1)}
                 </td>
             </tr>
              <tr>
               <td style="font-size: 10px">Cumulative Total:</td>
               <td style="text-align: right; font-size: 10px; font-weight: 700">${
        document?.currency
    }
                 ${addCurrencyCommas(document?.total.toFixed(2))}
                 </td>
             </tr>
              <tr>
               <td style="font-size: 10px">Amount Paid:</td>
               <td style="text-align: right; font-size: 10px; font-weight: 700">${
        document?.currency
    }
                 ${addCurrencyCommas(totalAmountReceived.toFixed(2))}
                 </td>
             </tr>
             <tr>
               <td style="font-size: 10px">Balance:</td>
               <td style="text-align: right; font-size: 10px; font-weight: 700">${
        document?.currency
    }
                 ${addCurrencyCommas(
        Math.round(
            document?.total -
            totalAmountReceived
        ).toFixed(2)
    )}
                 </td>
             </tr>
           </table>
    
     </section>
     <hr class="divider">
     <section class="row">
       <div class="two-column">
         <h4 style="font-size: 12px">Additional Info</h4>
         <hr class="divider">
         <p style="font-size: 10px">${document?.additionalInfo}</p>
       </div>
       <div class="two-column">
         <h4 style="font-size: 12px">Terms & Conditions</h4>
         <hr class="divider">
         <p style="font-size: 10px">${document?.termsConditions}</p>
       </div>
     </section>
   </div>
 </body>

</html>
	
	`;
}
