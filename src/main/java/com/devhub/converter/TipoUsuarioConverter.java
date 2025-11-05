package com.devhub.converter;

import com.devhub.model.TipoUsuario;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoUsuarioConverter implements AttributeConverter<TipoUsuario, String> {
    
    @Override
    public String convertToDatabaseColumn(TipoUsuario tipo) {
        if (tipo == null) {
            return null;
        }
        return tipo.name().toLowerCase();
    }
    
    @Override
    public TipoUsuario convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return TipoUsuario.valueOf(dbData.toLowerCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}

