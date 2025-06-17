package com.hyperformancelabs.backend.dto.response.analytics;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ChartResponse {
    @SerializedName("chart_type")
    private String chartType;

    @SerializedName("x_axis")
    private String xAxis;

    @SerializedName("y_axis")
    private List<String> yAxis;

    @SerializedName("group_by")
    private Object groupBy;

    private String sql;
    private String description;

    private List<Map<String, Object>> data;
} 