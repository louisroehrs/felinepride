package com.felinepride.app.graphql.util;



import org.glassfish.jersey.internal.util.Base64;

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
}
