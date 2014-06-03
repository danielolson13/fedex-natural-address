//insert text area into fedex.com 
$('#to\\.country\\.label').parent().prepend('<div id="to.pasteBox"><label for="toDatapastedData" class="fsmContentLeft">Paste Address</label><textarea id="toDataPastedData" name="toDataPastedData" rows="7" cols="24"></textarea></div>');
$('#from\\.country\\.label').parent().prepend('<div id="from.pasteBox"><label for="fromDataPastedData" class="fsmContentLeft">Paste Address</label><textarea id="fromDataPastedData" name="fromDataPastedData" rows="7" cols="24"></textarea></div>');

//trigger parseAddress on change to text area
$( '#toDataPastedData' ).on('paste change keyup',{name: '#toData'},parseAddress);
$( '#fromDataPastedData' ).on('paste change keyup',{name: '#fromData'},parseAddress);

function parseAddress(event) {
    theBox = event.data.name;
    var element = $(this);
    setTimeout(function () {
        var phoneNumberReg = /[0-9-()+]{9,20}/;
        var zipReg = /(\d{5})|(\d{5}-\d{4})/;
        var stateReg = /\s[a-zA-Z]{2}$/;
        var addressReg = /\d/;

        //get the data pasted into text area
        var theAdd = element.val();
        //use regex to find and remove Zip and phone number from the pasted address
        if($out = theAdd.match(zipReg)){
            $(theBox + '\\.zipPostalCode' ).val($out[0]);
            theAdd = theAdd.replace($out[0],'');
        }
        if($out = theAdd.match(phoneNumberReg)){
            $( theBox + '\\.phoneNumber' ).val($out[0]);
            theAdd = theAdd.replace($out[0],'');
        }
        // split the pasted text into an array by line breaks
        var $theArray = theAdd.trim().split('\n');
        var $i = ($theArray.length-1);

        //look for state code in last element of array
        if($out = $theArray[$i].match(stateReg)){
            $( theBox + '\\.stateProvinceCode' ).val($out[0].trim());
            $theArray[$i] = $theArray[$i].replace($out[0],'');
            $( theBox + '\\.city' ).val($theArray[$i].trim().replace(',',''));
        }
        if($i == 2){
            //only have 2 lines left and they must be contact name and address 1
            $( theBox + '\\.companyName' ).val('');
            $( theBox + '\\.contactName' ).val($theArray[0]);
            $( theBox + '\\.addressLine1' ).val($theArray[1]);
            $( theBox + '\\.addressLine2' ).val('');
            $i = -1;
        }else if($i == 3){
            // Three lines left check the second line to see if first character is a digit, 
            if(addressReg.test($theArray[1])){
                $( theBox + '\\.companyName' ).val('');
                $( theBox + '\\.contactName' ).val($theArray[0]);
                $( theBox + '\\.addressLine1' ).val($theArray[1]);
                $( theBox + '\\.addressLine2' ).val($theArray[2]);
            }else{
                // Here we think we have company name and only 1 address line
                $( theBox + '\\.companyName' ).val($theArray[0]);
                $( theBox + '\\.contactName' ).val($theArray[1]);
                $( theBox + '\\.addressLine1' ).val($theArray[2]);
                $( theBox + '\\.addressLine2' ).val('');
            }
        }else if($i == 4){
            $( theBox + '\\.companyName' ).val($theArray[0]);
            $( theBox + '\\.contactName' ).val($theArray[1]);
            $( theBox + '\\.addressLine1' ).val($theArray[2]);
            $( theBox + '\\.addressLine2' ).val($theArray[3]);
        }
                
  }, 100);//end setTimeout
  
    
} //end parseAddress

