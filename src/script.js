let connections = [];
        let animationRunning = false;
        let connectionsVisible = true;
        let currentConfig = {
            layers: {
                layer1: { 
                    name: '水源输入层', 
                    meaning: '系统的原始输入数据源', 
                    nodes: [
                        { 
                            name: '水源', 
                            description: '纯净水源 - 系统输入',
                            features: ['纯净度', '温度', '压力', 'pH值']
                        }
                    ],
                    features: ['纯净度', '温度', '压力'] 
                },
                layer2: { 
                    name: '原材料层', 
                    meaning: '处理输入的各种原材料和催化剂', 
                    nodes: [
                        { 
                            name: '糖化酶', 
                            description: '糖化酶 - 催化转化',
                            features: ['活性', '稳定性', '选择性', '温度适应性']
                        },
                        { 
                            name: '酵母菌', 
                            description: '酵母菌 - 发酵核心',
                            features: ['发酵能力', '酒精耐受性', '繁殖速度', '营养需求']
                        },
                        { 
                            name: '营养盐', 
                            description: '营养盐 - 提供养分',
                            features: ['溶解度', '营养价值', '纯度', '稳定性']
                        },
                        { 
                            name: 'pH调节剂', 
                            description: 'pH调节剂 - 环境优化',
                            features: ['缓冲能力', '调节范围', '稳定性', '副作用']
                        }
                    ],
                    features: ['催化效率', '反应速度', '稳定性', '成本'] 
                },
                layer3: { 
                    name: '蒸馏方法层', 
                    meaning: '各种蒸馏技术和处理方法', 
                    nodes: [
                        { 
                            name: '单次蒸馏', 
                            description: '单次蒸馏 - 基础分离',
                            features: ['分离效率', '能耗', '操作简便性', '成本']
                        },
                        { 
                            name: '二次蒸馏', 
                            description: '二次蒸馏 - 精细提纯',
                            features: ['纯度提升', '时间成本', '能耗', '设备要求']
                        },
                        { 
                            name: '分馏蒸馏', 
                            description: '分馏蒸馏 - 分段收集',
                            features: ['分离精度', '产物种类', '控制复杂度', '设备投资']
                        },
                        { 
                            name: '减压蒸馏', 
                            description: '减压蒸馏 - 低温处理',
                            features: ['低温操作', '热敏保护', '真空要求', '设备复杂度']
                        },
                        { 
                            name: '水蒸气蒸馏', 
                            description: '水蒸气蒸馏 - 温和提取',
                            features: ['温和性', '适用范围', '水消耗', '分离效果']
                        },
                        { 
                            name: '共沸蒸馏', 
                            description: '共沸蒸馏 - 组分分离',
                            features: ['共沸破除', '溶剂回收', '技术难度', '环保性']
                        },
                        { 
                            name: '分子蒸馏', 
                            description: '分子蒸馏 - 高纯度',
                            features: ['超高纯度', '高真空', '设备投资', '操作难度']
                        },
                        { 
                            name: '膜蒸馏', 
                            description: '膜蒸馏 - 新型技术',
                            features: ['节能性', '膜寿命', '技术新颖', '应用前景']
                        },
                        { 
                            name: '反应蒸馏', 
                            description: '反应蒸馏 - 一体化',
                            features: ['一体化', '效率提升', '设备集成', '控制复杂度']
                        }
                    ],
                    features: ['分离精度', '处理速度', '能耗', '技术复杂度', '产品纯度'] 
                },
                layer4: { 
                    name: '专家模型输出层', 
                    meaning: '最终的专家决策输出', 
                    nodes: [
                        { 
                            name: '质量专家', 
                            description: '质量控制专家模型',
                            features: ['纯度评估', '杂质检测', '标准符合性', '质量稳定性']
                        },
                        { 
                            name: '效率专家', 
                            description: '生产效率专家模型',
                            features: ['产出速度', '设备利用率', '人工效率', '时间优化']
                        },
                        { 
                            name: '成本专家', 
                            description: '成本优化专家模型',
                            features: ['原料成本', '设备成本', '人工成本', '综合成本']
                        }
                    ],
                    features: ['质量评估', '效率评估', '成本评估'] 
                }
            },
            examples: [
                { question: '需要高质量产品', path: 'A1→B1,B2→C1,C3,C5→D1', logic: '使用糖化酶和酵母菌，通过精细蒸馏方法，输出到质量专家' },
                { question: '需要快速生产', path: 'A1→B2,B4→C2,C4,C6,C8→D2', logic: '使用快速发酵和环境优化，采用高效蒸馏方法，输出到效率专家' }
            ],
            openai: {
                url: 'https://api.openai.com/v1/chat/completions',
                key: '',
                model: 'gpt-3.5-turbo'
            }
        };

        // 定义每层的节点数量
        const layerNodeCounts = {
            layer1: 1,
            layer2: 4, 
            layer3: 9,
            layer4: 3
        };
        
        // 定义三条特定路径
        const pathways = {
            pathway1: {
                name: '质量专家路径',
                color: '#4FC3F7',
                path: [
                    { from: 'A1', to: ['B1', 'B2'] },
                    { from: ['B1', 'B2'], to: ['C1', 'C3', 'C5'] },
                    { from: ['C1', 'C3', 'C5'], to: ['D1'] }
                ]
            },
            pathway2: {
                name: '效率专家路径', 
                color: '#66BB6A',
                path: [
                    { from: 'A1', to: ['B2', 'B4'] },
                    { from: ['B2', 'B4'], to: ['C2', 'C4', 'C6', 'C8'] },
                    { from: ['C2', 'C4', 'C6', 'C8'], to: ['D2'] }
                ]
            },
            pathway3: {
                name: '成本专家路径',
                color: '#FF7043', 
                path: [
                    { from: 'A1', to: ['B1', 'B3', 'B4'] },
                    { from: ['B1', 'B3', 'B4'], to: ['C1', 'C7', 'C9'] },
                    { from: ['C1', 'C7', 'C9'], to: ['D3'] }
                ]
            }
        };

        // 配置相关函数
        function openConfig() {
            document.getElementById('configModal').style.display = 'block';
            loadConfig();
        }

        function closeConfig() {
            document.getElementById('configModal').style.display = 'none';
        }

        function exportConfig() {
            const configData = JSON.stringify(currentConfig, null, 4); // 格式化JSON，方便阅读
            const blob = new Blob([configData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'distillation_config.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('配置已导出为 distillation_config.json');
        }

        function importConfig(event) {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedConfig = JSON.parse(e.target.result);
                    // 简单的结构验证，确保是预期的配置对象
                    if (importedConfig && importedConfig.layers && importedConfig.openai) {
                        currentConfig = importedConfig;
                        localStorage.setItem('distillationConfig', JSON.stringify(currentConfig));
                        loadConfig(); // 重新加载配置并更新UI
                        alert('配置导入成功！');
                        closeConfig();
                    } else {
                        alert('导入的JSON文件格式不正确，请检查！');
                    }
                } catch (error) {
                    console.error('解析JSON文件失败:', error);
                    alert('导入文件解析失败，请确保它是有效的JSON文件！');
                }
            };
            reader.readAsText(file);
        }

        function showTab(tabName) {
            // 隐藏所有TAB内容
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 显示选中的TAB
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        function addFeature(layerId) {
            const container = document.getElementById(layerId + 'Features');
            const featureDiv = document.createElement('div');
            featureDiv.className = 'feature-item';
            featureDiv.innerHTML = `
                <input type="text" placeholder="输入特征名称">
                <button class="remove-feature-btn" onclick="this.parentElement.remove()">删除</button>
            `;
            container.appendChild(featureDiv);
        }

        function addNodeFeature(button) {
            const container = button.parentElement.querySelector('.node-features-list');
            const featureDiv = document.createElement('div');
            featureDiv.className = 'feature-item';
            featureDiv.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background: white; border-radius: 5px; border: 1px solid #e9ecef;';
            featureDiv.innerHTML = `
                <input type="text" placeholder="输入特征名称" style="flex: 1; padding: 4px 8px; border: 1px solid #ced4da; border-radius: 3px; font-size: 13px;">
                <button class="remove-feature-btn" onclick="this.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin-left: 8px; font-size: 12px;">删除</button>
            `;
            container.appendChild(featureDiv);
        }

        function addExample() {
            const container = document.getElementById('examplesList');
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'example-config';
            exampleDiv.innerHTML = `
                <h4>自定义示例</h4>
                <div class="form-group">
                    <label>用户问题：</label>
                    <input type="text" placeholder="输入示例问题">
                </div>
                <div class="form-group">
                    <label>推荐路径：</label>
                    <input type="text" placeholder="例如：A1→B1,B2→C1,C3→D1">
                </div>
                <div class="form-group">
                    <label>逻辑说明：</label>
                    <textarea placeholder="解释为什么选择这个路径"></textarea>
                </div>
                <button class="remove-feature-btn" onclick="this.parentElement.remove()">删除示例</button>
            `;
            container.appendChild(exampleDiv);
        }

        function updateNodeNames() {
            // 更新第一层节点
            currentConfig.layers.layer1.nodes.forEach((nodeInfo, index) => {
                const nodeId = `node-A${index + 1}`;
                const nodeElement = document.getElementById(nodeId);
                if (nodeElement) {
                    const textElement = nodeElement.querySelector('.node-text');
                    const tooltipElement = nodeElement.querySelector('.tooltip');
                    if (textElement) {
                        textElement.textContent = nodeInfo.name;
                    }
                    if (tooltipElement) {
                        tooltipElement.textContent = nodeInfo.description;
                    }
                }
            });

            // 更新第二层节点
            currentConfig.layers.layer2.nodes.forEach((nodeInfo, index) => {
                const nodeId = `node-B${index + 1}`;
                const nodeElement = document.getElementById(nodeId);
                if (nodeElement) {
                    const textElement = nodeElement.querySelector('.node-text');
                    const tooltipElement = nodeElement.querySelector('.tooltip');
                    if (textElement) {
                        textElement.textContent = nodeInfo.name;
                    }
                    if (tooltipElement) {
                        tooltipElement.textContent = nodeInfo.description;
                    }
                }
            });

            // 更新第三层节点
            currentConfig.layers.layer3.nodes.forEach((nodeInfo, index) => {
                const nodeId = `node-C${index + 1}`;
                const nodeElement = document.getElementById(nodeId);
                if (nodeElement) {
                    const textElement = nodeElement.querySelector('.node-text');
                    const tooltipElement = nodeElement.querySelector('.tooltip');
                    if (textElement) {
                        textElement.textContent = nodeInfo.name;
                    }
                    if (tooltipElement) {
                        tooltipElement.textContent = nodeInfo.description;
                    }
                }
            });

            // 更新第四层节点
            currentConfig.layers.layer4.nodes.forEach((nodeInfo, index) => {
                const nodeId = `node-D${index + 1}`;
                const nodeElement = document.getElementById(nodeId);
                if (nodeElement) {
                    const textElement = nodeElement.querySelector('.node-text');
                    const tooltipElement = nodeElement.querySelector('.tooltip');
                    if (textElement) {
                        textElement.textContent = nodeInfo.name;
                    }
                    if (tooltipElement) {
                        tooltipElement.textContent = nodeInfo.description;
                    }
                }
            });
        }

        function saveConfig() {
            // 保存层级配置
            for (let i = 1; i <= 4; i++) {
                const layerId = 'layer' + i;
                const expectedNodeCount = layerNodeCounts[layerId];
                
                // 获取节点名称和描述输入框的值
                const nodeContainers = document.querySelectorAll(`#${layerId}Nodes .node-config`);
                const nodes = [];
                
                for (let j = 0; j < expectedNodeCount; j++) {
                    let nodeInfo;
                    if (j < nodeContainers.length) {
                        const nameInput = nodeContainers[j].querySelector('.node-name-input');
                        const descInput = nodeContainers[j].querySelector('.node-desc-input');
                        const featureInputs = nodeContainers[j].querySelectorAll('.node-features-list input');
                        
                        const nodeName = nameInput ? nameInput.value.trim() : '';
                        const nodeDesc = descInput ? descInput.value.trim() : '';
                        const nodeFeatures = Array.from(featureInputs).map(input => input.value.trim()).filter(v => v);
                        
                        nodeInfo = {
                            name: nodeName || (j < currentConfig.layers[layerId].nodes.length ? currentConfig.layers[layerId].nodes[j].name : `节点${j + 1}`),
                            description: nodeDesc || (j < currentConfig.layers[layerId].nodes.length ? currentConfig.layers[layerId].nodes[j].description : `节点${j + 1}描述`),
                            features: nodeFeatures.length > 0 ? nodeFeatures : (j < currentConfig.layers[layerId].nodes.length && currentConfig.layers[layerId].nodes[j].features ? currentConfig.layers[layerId].nodes[j].features : [])
                        };
                    } else if (j < currentConfig.layers[layerId].nodes.length) {
                        nodeInfo = currentConfig.layers[layerId].nodes[j];
                    } else {
                        nodeInfo = { name: `节点${j + 1}`, description: `节点${j + 1}描述`, features: [] };
                    }
                    nodes.push(nodeInfo);
                }
                
                currentConfig.layers[layerId] = {
                    name: document.getElementById(layerId + 'Name').value,
                    meaning: document.getElementById(layerId + 'Meaning').value,
                    nodes: nodes,
                    features: Array.from(document.querySelectorAll(`#${layerId}Features input`))
                        .map(input => input.value.trim()).filter(v => v)
                };
            }
            
            // 保存OpenAI配置
            currentConfig.openai = {
                url: document.getElementById('openaiUrl').value,
                key: document.getElementById('openaiKey').value,
                model: document.getElementById('openaiModel').value
            };
            
            // 保存到localStorage
            localStorage.setItem('distillationConfig', JSON.stringify(currentConfig));
            
            // 更新节点显示
            updateNodeNames();
            
            alert('配置已保存！节点名称和描述已更新。');
            closeConfig();
        }

        function loadConfig() {
            const saved = localStorage.getItem('distillationConfig');
            if (saved) {
                currentConfig = JSON.parse(saved);
            }
            
            // 加载层级配置
            for (let i = 1; i <= 4; i++) {
                const layerId = 'layer' + i;
                const config = currentConfig.layers[layerId];
                const expectedNodeCount = layerNodeCounts[layerId];
                
                document.getElementById(layerId + 'Name').value = config.name;
                document.getElementById(layerId + 'Meaning').value = config.meaning;
                
                // 加载节点名称和描述
                const nodesContainer = document.getElementById(layerId + 'Nodes');
                nodesContainer.innerHTML = '';
                
                // 显示正确数量的节点输入框
                for (let j = 0; j < expectedNodeCount; j++) {
                    const nodeInfo = j < config.nodes.length ? config.nodes[j] : { name: `节点${j + 1}`, description: `节点${j + 1}描述`, features: [] };
                    const nodeDiv = document.createElement('div');
                    nodeDiv.className = 'node-config';
                    nodeDiv.style.cssText = 'margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;';
                    
                    // 生成特征列表HTML
                    const featuresHtml = (nodeInfo.features || []).map(feature => `
                        <div class="feature-item" style="display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background: white; border-radius: 5px; border: 1px solid #e9ecef;">
                            <input type="text" value="${feature}" style="flex: 1; padding: 4px 8px; border: 1px solid #ced4da; border-radius: 3px; font-size: 13px;">
                            <button class="remove-feature-btn" onclick="this.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin-left: 8px; font-size: 12px;">删除</button>
                        </div>
                    `).join('');
                    
                    nodeDiv.innerHTML = `
                        <div style="margin-bottom: 12px;">
                            <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #495057; font-size: 15px;">节点${j + 1} 名称：</label>
                            <input type="text" class="node-name-input" value="${nodeInfo.name}" placeholder="输入节点名称" 
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div style="margin-bottom: 12px;">
                            <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #495057; font-size: 15px;">节点${j + 1} 描述：</label>
                            <input type="text" class="node-desc-input" value="${nodeInfo.description}" placeholder="输入节点描述" 
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #495057; font-size: 15px;">节点${j + 1} 特征：</label>
                            <div class="node-features-list">
                                ${featuresHtml}
                            </div>
                            <button class="add-node-feature-btn" onclick="addNodeFeature(this)" 
                                    style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 13px; margin-top: 8px;">
                                + 添加特征
                            </button>
                        </div>
                    `;
                    nodesContainer.appendChild(nodeDiv);
                }
                
                // 加载特征
                const featuresContainer = document.getElementById(layerId + 'Features');
                featuresContainer.innerHTML = '';
                config.features.forEach(feature => {
                    const featureDiv = document.createElement('div');
                    featureDiv.className = 'feature-item';
                    featureDiv.innerHTML = `
                        <input type="text" value="${feature}">
                        <button class="remove-feature-btn" onclick="this.parentElement.remove()">删除</button>
                    `;
                    featuresContainer.appendChild(featureDiv);
                });
            }
            
            // 加载OpenAI配置
            document.getElementById('openaiUrl').value = currentConfig.openai.url;
            document.getElementById('openaiKey').value = currentConfig.openai.key;
            document.getElementById('openaiModel').value = currentConfig.openai.model;
            
            // 更新节点显示
            updateNodeNames();
        }

        function generatePrompt(userQuestion) {
            // 生成详细的节点信息
            let detailedNodesInfo = '';
            
            Object.entries(currentConfig.layers).forEach(([layerKey, layer], layerIndex) => {
                const layerNumber = layerIndex + 1;
                const layerLetter = String.fromCharCode(65 + layerIndex); // A, B, C, D
                
                detailedNodesInfo += `\n第${layerNumber}层 - ${layer.name}：\n`;
                detailedNodesInfo += `层含义：${layer.meaning}\n`;
                
                layer.nodes.forEach((node, nodeIndex) => {
                    const nodeId = `${layerLetter}${nodeIndex + 1}`;
                    detailedNodesInfo += `  ${nodeId}. ${node.name}\n`;
                    detailedNodesInfo += `     描述：${node.description}\n`;
                    if (node.features && node.features.length > 0) {
                        detailedNodesInfo += `     特征：${node.features.join('、')}\n`;
                    }
                    detailedNodesInfo += `\n`;
                });
            });
            
            // 生成节点编号对照表
            const nodeMapping = Object.entries(currentConfig.layers).map(([layerKey, layer], layerIndex) => {
                const layerLetter = String.fromCharCode(65 + layerIndex);
                const nodeList = layer.nodes.map((node, nodeIndex) => 
                    `${layerLetter}${nodeIndex + 1}-${node.name}`
                ).join(', ');
                return `第${layerIndex + 1}层(${layerLetter}): ${nodeList}`;
            }).join('\n');
            
            const examples = currentConfig.examples
                .map(ex => `问题: ${ex.question}\n路径: ${ex.path}\n逻辑: ${ex.logic}`)
                .join('\n\n');
            
            return `你是一个蒸馏专家系统。根据以下详细的节点信息和示例，为用户问题推荐最合适的处理路径。\n\n=== 详细节点信息 ===${detailedNodesInfo}\n\n=== 节点编号对照表 ===\n${nodeMapping}\n\n=== 路径推荐示例 ===\n${examples}\n\n=== 用户问题 ===\n${userQuestion}\n\n=== 分析要求 ===\n请根据用户问题，结合每个节点的特征和描述，选择最合适的处理路径：\n\n1. 第一层(A)：固定选择 A1-${currentConfig.layers.layer1.nodes[0].name}\n2. 第二层(B)：根据问题需求，从4个原材料中选择合适的（可多选）\n   - 考虑每种原材料的特征和适用场景\n3. 第三层(C)：根据质量、效率、成本需求，从9种蒸馏方法中选择（可多选）\n   - 考虑每种方法的分离精度、能耗、复杂度等特征\n4. 第四层(D)：根据最终目标，选择对应的专家模型\n   - D1-质量专家：追求高纯度、高质量\n   - D2-效率专家：追求高效率、快速生产\n   - D3-成本专家：追求低成本、经济性\n\n请返回JSON格式的路径推荐，格式如下：\n{"ONE":["A1"],"TWO":["B1","B2"],"THREE":["C1","C3","C4"],"FOUR":["D1"]}\n\n注意：只返回JSON，不要其他解释文字。`;
        }

        async function analyzeQuestion() {
            const question = document.getElementById('userQuestion').value.trim();
            if (!question) {
                alert('请输入问题！');
                return;
            }
            
            if (!currentConfig.openai.key) {
                alert('请先配置OpenAI API Key！');
                openConfig();
                showTab('openai');
                return;
            }
            
            try {
                const prompt = generatePrompt(question);
                console.log('Generated prompt:', prompt);
                
                const response = await fetch(currentConfig.openai.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentConfig.openai.key}`
                    },
                    body: JSON.stringify({
                        model: currentConfig.openai.model,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API请求失败: ${response.status}`);
                }
                
                const data = await response.json();
                const aiResponse = data.choices[0].message.content;
                console.log('AI Response:', aiResponse);
                
                // 解析JSON响应
                const pathRecommendation = JSON.parse(aiResponse);
                console.log('Parsed path:', pathRecommendation);
                
                // 根据AI推荐的路径高亮显示
                highlightAIPath(pathRecommendation);
                
            } catch (error) {
                console.error('AI分析失败:', error);
                alert('AI分析失败: ' + error.message);
            }
        }

        function highlightAIPath(pathData) {
            resetAnimation();
            
            // 创建自定义路径
            const aiPathway = {
                name: 'AI推荐路径',
                color: '#FFD700',
                path: [
                    { from: pathData.ONE, to: pathData.TWO },
                    { from: pathData.TWO, to: pathData.THREE },
                    { from: pathData.THREE, to: pathData.FOUR }
                ]
            };
            
            // 清除现有连接并创建AI路径连接
            connections.forEach(conn => conn.remove());
            connections = [];
            
            // 创建AI推荐的连接线
            aiPathway.path.forEach(step => {
                const fromNodes = Array.isArray(step.from) ? step.from : [step.from];
                const toNodes = Array.isArray(step.to) ? step.to : [step.to];
                
                fromNodes.forEach(fromId => {
                    toNodes.forEach(toId => {
                        createConnection(fromId, toId, aiPathway.color, 'ai-pathway');
                    });
                });
            });
            
            // 播放动画
            setTimeout(() => {
                animatePathway(aiPathway, 'ai-pathway', 0);
            }, 500);
        }

        function createConnections() {
            const network = document.getElementById('network');
            
            // 清除现有连接
            connections.forEach(conn => conn.remove());
            connections = [];

            // 为每个路径创建连接线
            Object.keys(pathways).forEach(pathKey => {
                const pathway = pathways[pathKey];
                pathway.path.forEach(step => {
                    const fromNodes = Array.isArray(step.from) ? step.from : [step.from];
                    const toNodes = Array.isArray(step.to) ? step.to : [step.to];
                    
                    fromNodes.forEach(fromId => {
                        toNodes.forEach(toId => {
                            createConnection(fromId, toId, pathway.color, pathKey);
                        });
                    });
                });
            });
        }

        function getNodeById(nodeId) {
            const layer = nodeId[0];
            const index = parseInt(nodeId.slice(1)) - 1;
            
            let selector;
            switch(layer) {
                case 'A': selector = '[data-layer="input"]'; break;
                case 'B': selector = '[data-layer="material"]'; break;
                case 'C': selector = '[data-layer="distillation"]'; break;
                case 'D': selector = '[data-layer="expert"]'; break;
            }
            
            const nodes = document.querySelectorAll(selector);
            return nodes[index];
        }

        function getNodeEdgePosition(node, targetNode) {
            const nodeRect = node.getBoundingClientRect();
            const targetRect = targetNode.getBoundingClientRect();
            const networkRect = document.getElementById('network').getBoundingClientRect();
            
            const nodeCenterX = nodeRect.left + nodeRect.width / 2 - networkRect.left;
            const nodeCenterY = nodeRect.top + nodeRect.height / 2 - networkRect.top;
            const targetCenterX = targetRect.left + targetRect.width / 2 - networkRect.left;
            const targetCenterY = targetRect.top + targetRect.height / 2 - networkRect.top;
            
            // 计算方向向量
            const dx = targetCenterX - nodeCenterX;
            const dy = targetCenterY - nodeCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 计算节点边缘点（从中心向目标方向偏移半径距离）
            const radius = nodeRect.width / 2 - 2; // 稍微内缩避免重叠
            const offsetX = (dx / distance) * radius;
            const offsetY = (dy / distance) * radius;
            
            return {
                x: nodeCenterX + offsetX,
                y: nodeCenterY + offsetY
            };
        }

        function createConnection(fromId, toId, color, pathway) {
            const fromNode = getNodeById(fromId);
            const toNode = getNodeById(toId);
            
            if (!fromNode || !toNode) return;
            
            const startPos = getNodeEdgePosition(fromNode, toNode);
            const endPos = getNodeEdgePosition(toNode, fromNode);
            
            const deltaX = endPos.x - startPos.x;
            const deltaY = endPos.y - startPos.y;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            const connection = document.createElement('div');
            connection.className = 'connection';
            connection.setAttribute('data-pathway', pathway);
            connection.setAttribute('data-from', fromId);
            connection.setAttribute('data-to', toId);
            connection.style.position = 'absolute';
            connection.style.left = startPos.x + 'px';
            connection.style.top = startPos.y + 'px';
            connection.style.width = length + 'px';
            connection.style.height = '3px';
            connection.style.background = `rgba(${hexToRgb(color)}, 0.3)`;
            connection.style.transformOrigin = '0 50%';
            connection.style.transform = `rotate(${angle}deg)`;
            connection.style.opacity = '0.7';
            connection.style.transition = 'all 0.3s ease';
            connection.style.display = connectionsVisible ? 'block' : 'none';
            connection.style.zIndex = '1';
            connection.style.borderRadius = '2px';

            document.getElementById('network').appendChild(connection);
            connections.push(connection);
        }

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 
                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
                '0, 0, 0';
        }

        function startAnimation() {
            if (animationRunning) return;
            
            animationRunning = true;
            
            // 重置所有状态
            resetAnimation();
            
            let delay = 0;
            
            // 依次展示三条路径
            Object.keys(pathways).forEach((pathKey, pathIndex) => {
                const pathway = pathways[pathKey];
                
                setTimeout(() => {
                    animatePathway(pathway, pathKey, pathIndex);
                }, delay);
                
                delay += 4000; // 每条路径间隔4秒
            });
            
            // 最终展示所有路径
            setTimeout(() => {
                showAllPathways();
            }, delay);
            
            setTimeout(() => {
                animationRunning = false;
            }, delay + 3000);
        }

        function animatePathway(pathway, pathKey, pathIndex) {
            console.log(`展示${pathway.name}`);
            
            let stepDelay = 0;
            
            pathway.path.forEach((step, stepIndex) => {
                setTimeout(() => {
                    const fromNodes = Array.isArray(step.from) ? step.from : [step.from];
                    const toNodes = Array.isArray(step.to) ? step.to : [step.to];
                    
                    // 激活起始节点
                    fromNodes.forEach(nodeId => {
                        const node = getNodeById(nodeId);
                        if (node) {
                            node.classList.add('active');
                            node.style.boxShadow = `0 0 20px ${pathway.color}`;
                        }
                    });
                    
                    // 激活连接线
                    setTimeout(() => {
                        fromNodes.forEach(fromId => {
                            toNodes.forEach(toId => {
                                const connection = document.querySelector(
                                    `[data-pathway="${pathKey}"][data-from="${fromId}"][data-to="${toId}"]`
                                );
                                if (connection) {
                                    connection.style.background = `linear-gradient(90deg, ${pathway.color}, ${pathway.color})`;
                                    connection.style.opacity = '1';
                                    connection.style.boxShadow = `0 0 8px ${pathway.color}`;
                                    connection.style.height = '4px';
                                    connection.classList.add('active');
                                }
                            });
                        });
                        
                        // 激活目标节点
                        setTimeout(() => {
                            toNodes.forEach(nodeId => {
                                const node = getNodeById(nodeId);
                                if (node) {
                                    node.classList.add('active');
                                    node.style.boxShadow = `0 0 20px ${pathway.color}`;
                                }
                            });
                        }, 300);
                    }, 200);
                    
                }, stepDelay);
                
                stepDelay += 1000;
            });
        }

        function showAllPathways() {
            // 显示所有路径的最终效果
            connections.forEach(conn => {
                const pathway = conn.getAttribute('data-pathway');
                const color = pathways[pathway].color;
                conn.style.background = `linear-gradient(90deg, ${color}, ${color})`;
                conn.style.opacity = '0.8';
                conn.style.boxShadow = `0 0 6px ${color}`;
                conn.classList.add('active');
            });
            
            document.querySelectorAll('.node').forEach(node => {
                node.classList.add('active');
            });
        }

        function resetAnimation() {
            animationRunning = false;
            
            // 重置连接线
            document.querySelectorAll('.connection').forEach(conn => {
                conn.classList.remove('active');
                const pathway = conn.getAttribute('data-pathway');
                const color = pathways[pathway].color;
                conn.style.background = `rgba(${hexToRgb(color)}, 0.3)`;
                conn.style.opacity = '0.7';
                conn.style.boxShadow = 'none';
                conn.style.height = '3px';
                conn.style.animation = 'none';
            });
            
            // 重置节点
            document.querySelectorAll('.node').forEach(node => {
                node.classList.remove('active');
                node.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            });
        }

        function toggleConnections() {
            connectionsVisible = !connectionsVisible;
            connections.forEach(conn => {
                conn.style.display = connectionsVisible ? 'block' : 'none';
            });
        }

        // 确保DOM完全加载后再创建连接
        function initializeNetwork() {
            setTimeout(() => {
                updateNodeNames(); // 初始化时更新节点名称
                createConnections();
            }, 800);
        }

        // 页面加载完成后初始化网络
        window.addEventListener('load', initializeNetwork);

        // 窗口大小改变时重新创建连接
        window.addEventListener('resize', () => {
            setTimeout(createConnections, 300);
        });

        // 节点悬停效果
        document.addEventListener('DOMContentLoaded', () => {
            const nodes = document.querySelectorAll('.node');
            nodes.forEach(node => {
                node.addEventListener('mouseenter', () => {
                    node.style.zIndex = '100';
                });
                
                node.addEventListener('mouseleave', () => {
                    node.style.zIndex = 'auto';
                });
            });
            
            // 初始化时立即更新节点名称
            setTimeout(() => {
                updateNodeNames();
            }, 1000);
        }); 