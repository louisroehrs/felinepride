package com.felinepride.app.graphql.util;



import org.apache.commons.lang3.StringUtils;
import org.glassfish.jersey.internal.util.Base64;

import javax.crypto.KeyGenerator;
import java.nio.ByteBuffer;
import java.nio.LongBuffer;
import java.util.UUID;

public class EncodingUtil {
    public static final String DEFAULT_ENCODING = "UTF-8";


    public static String base64Encode(String text) {
            
        return Base64.encodeAsString(text);
    }//base64encode

    public static String base64Decode(String text) {
        return Base64.decodeAsString(text);
    }//base64 decode

    public static String encodeMessage(String msg, String key) {
        String xorMsg = xorString(msg,key);
        return base64Encode(xorMsg);
    }

    public static String decodeMessage(String encodedStr, String key) {
        String xorredMsg = xorString(encodedStr, key);
        return base64Decode(xorredMsg);
    }

    public static String xorString(String message,String key) {
        try {
            if (message == null || key == null) return null;

            char[] keys = key.toCharArray();
            char[] mesg = message.toCharArray();

            int ml = mesg.length;
            int kl = keys.length;
            char[] newmsg = new char[ml];

            for (int i = 0; i < ml; i++) {
                newmsg[i] = (char) (mesg[i] ^ keys[i % kl]);
            }//for i

            return new String( newmsg );
        } catch (Exception e) {
            return null;
        }
    }//xorMessage

    private static Base64 BASE64 = new Base64();
    public static String generateShortUUID(){
        UUID uuid = UUID.randomUUID();
        /*
        byte[] uuidArray = toByteArray(uuid);
        byte[] encodedArray = BASE64.encode(uuidArray);
        String returnValue = new String(encodedArray);
        returnValue = StringUtils.removeEnd(returnValue, "\r\n");*/
        return uuid.toString();
    }
    /*
    public static UUID convertKey(String key){
        UUID returnValue = null;
        if(StringUtils.isNotBlank(key)){
            // Convert base64 string to a byte array
            byte[] decodedArray = BASE64.decode(key);
            returnValue = fromByteArray(decodedArray);
        }
        return returnValue;
    }
    */

    private static byte[] toByteArray(UUID uuid) {
        byte[] byteArray = new byte[(Long.SIZE / Byte.SIZE) * 4];
        ByteBuffer buffer = ByteBuffer.wrap(byteArray);
        LongBuffer longBuffer = buffer.asLongBuffer();
        longBuffer.put(new long[] { uuid.getMostSignificantBits(), uuid.getLeastSignificantBits() });
        return byteArray;
    }
    private static UUID fromByteArray(byte[] bytes) {
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        LongBuffer longBuffer = buffer.asLongBuffer();
        return new UUID(longBuffer.get(0), longBuffer.get(1));
    }
}
