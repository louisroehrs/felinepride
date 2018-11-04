package com.felinepride.app.graphql.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.ByteArrayInputStream;
import java.io.IOException;

public class StreamSerializer extends JsonSerializer<ByteArrayInputStream> {

    @Override
    public void serialize(ByteArrayInputStream content,
                          JsonGenerator jsonGenerator,
                          SerializerProvider serializerProvider)
            throws IOException, JsonProcessingException {
        jsonGenerator.writeBinary(content, -1);
    }
}
