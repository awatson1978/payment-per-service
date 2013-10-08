var default_from_address = 'somebody@somewhere.com';
var default_subject = 'Donation Receipt';


var StripeAPI = Npm.require('stripe');


// PENTASYLLABIC PRIVATE KEY:
// test key
var Stripe = StripeAPI('sk_test_ladsncknoidnfgoivn');

// live key
//var Stripe = StripeAPI('sk_live_dsflkvnediolnvdfin');

Meteor.methods({
    validateCharge: function (rawFormData) {
        try{
            console.log('received a rawFormData: ' + JSON.stringify(rawFormData));

            rawFormData = rawFormData || {};

            var result = "...";
            Stripe.charges.create({
                amount: rawFormData.chargeAmount * 100,
                currency: "USD",
                card: {
                    number: rawFormData.creditCardNumber,
                    exp_month: rawFormData.creditCardMonth,
                    exp_year: rawFormData.creditCardYear
                }
            }, function (error, result) {
                console.log(error, result);
                if(error){
                    console.log('Stripe returned an error...');
                    return error;
                }else{
                    console.log('Stripe returned an result...');
                    return result;
                }
            });

            //check([to, from, subject, text], [String]);
            this.unblock();

            var emailText = "Dear " + rawFormData.creditCardName + ", Thank you for donating.  Your credit card has been billed for the amount of $" + rawFormData.chargeAmount + ".  If there are any concerns, please contact us at donations@test.org.  And, once again...  Thank You for Your Support!";
            Email.send({
              to: rawFormData.emailReceipt,
              from: "donations@test.org",
              subject: "Donation Receipt",
              text: emailText
            });

        }catch(error){
            console.log(error);
        }
    }

});