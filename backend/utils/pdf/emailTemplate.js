import moment from "moment";

export default function ({profile, document, totalAmountReceived}) {
    return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
        <style> 
          html, body {
            margin: 0 auto;
            padding: 0;
          }
          .header{
            line-height: 20px;
            font-size: 24px;
          }
          .container{
            background-color: #5a5a5a;
            font-family: Arial,Helvetica, sans-serif;
            width: 100%;
            color: #484b5b;
            padding: 20px 0;
          }
          .content{
            text-align: center;
            background-color: white;
            width: 75%;
            margin: 0 auto;
            padding: 25px;
          }
          .logo{
            width: 150px;
            margin: 0 auto;
          }
          .divider{
            height: 3px;
            background-color: rgb(17,65,141);
            margin-bottom: 10px;
            margin-top: 10px;
          }
          .footer{
            text-align: center;
          }
          .footer p {
            line-height: 7px;
            font-size: 15px;
          }

          .footer h2 {
            font-size: 17px;
          }
        
        </style>
        <title>Email Template</title>
      </head>

      <body>
          <div class="container">
          <div class="content">
            <img src=${profile?.avatar} class="logo" alt="logo"/>
            <h1 class="header"> ${
        profile?.businessName
            ? profile?.businessName
            : profile.firstName
    }</h1>

      <hr class="divider">
      <p style="font-size: 18px">Dear Esteemed customer, ${
        document.customer.name
    }</p>
    <p style="font-size: 18px">I trust this email find you well. Kindly find attached as a pdf your, ${
        document.documentType
    }</p>
  <p style="font-size: 18px">If you have paid, please ignore this message... Your current balance is <b>${
        document?.currency
    }</b>
  <b> ${Math.round(document?.total - totalAmountReceived).toFixed(
        2
    )}</b> , due on <b>${moment(document?.dueDate).format("DD-MM-YYYY")}</b>
  </p>

  <div class="footer">
    <h2>${profile?.businessName}</h2>
    <p>${profile?.phoneNumber}</p>
  
  </div>
          </div>
      </body>
  
  </html>
  
  
  `;
}
